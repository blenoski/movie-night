const path = require('path')
const { RateLimiter } = require('limiter')
const logger = require('./backgroundWorkerLogger')

// Movie metadata source.
// Poster is a link to an external image.
const OMDB_API = 'http://www.omdbapi.com/?plot=full&t='
const YEAR_PARAM = '&y='

// We will limit our requests to a maximum of 40 per 10 seconds.
const milliseconds = 10 * 1000
let limiter = new RateLimiter(40, milliseconds)

// Fetch metadata for the movie from the web.
// These requests are rate limited to prevent slamming the server and are
// asynchronous so we can process a movie as soon as we receive its metadata.
function fetchDataFor (query, callback) {
  limiter.removeTokens(1, function (err, remainingRequests) {
    if (err) {
      logger.error(err)
    }

    const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
    let url = `${OMDB_API}${query.title}${year}`

    /* global XMLHttpRequest */
    var req = new XMLHttpRequest()
    req.addEventListener('load', callback)
    req.open('GET', url)
    req.send()
  })
}

// Movie file names are often decorated with metadata that will cause
// online searches to fail. Try and strip out anything that looks like metadata.
// Here we will return an array of search queries ranked in order of search preference.
function getSearchQueriesFor (movieFile) {
  // Extract the file name
  const { name } = path.parse(movieFile)

  // Extract potential release years from file name.
  let releaseYears = name.split(/[\D]/).filter((str) => {
    const year = Number(str)
    return year >= 1900 && year <= 2099
  })

  // Delete anything that looks like metadata encoded in the title.
  // As soon as we find metadata, we delete everything following it.
  const cleanName = name
    .replace(/\.avi.*/, '') // remove .avi
    .replace(/\./g, ' ') // replace periods with spaces
    .replace(/_/g, ' ') // replace underscores with spaces
    .replace(/-/g, ' ') // replace dashes with spaces
    .replace(/\(.*?\).*/, '') // remove all text in parens
    .replace(/\[.*?\].*/, '') // remove all text in brackets
    .replace(/{.*?}.*/, '') // remove all text in curly braces
    .replace(/1080p.*/i, '')
    .replace(/720p.*/i, '')
    .replace(/480p.*/i, '')
    .replace(/aac.*/i, '')
    .replace(/ac3.*/i, '')
    .replace(/axxo.*/i, '')
    .replace(/blueray.*/i, '')
    .replace(/bluray.*/i, '')
    .replace(/brrip.*/i, '')
    .replace(/cm8.*/i, '')
    .replace(/dmt.*/i, '')
    .replace(/dvdrip.*/i, '')
    .replace(/dvdsrc.*/i, '')
    .replace(/dvd.*/i, '') // keep this below dvdrip and dvdsrc
    .replace(/etrg.*/i, '')
    .replace(/fxg.*/i, '')
    .replace(/h264.*/i, '')
    .replace(/hdrip.*/i, '')
    .replace(/hdtv.*/i, '')
    .replace(/jaybob.*/i, '')
    .replace(/juggs.*/i, '')
    .replace(/mkv.*/i, '')
    .replace(/mp3.*/i, '')
    .replace(/nl subs.*/i, '')
    .replace(/no1knows.*/i, '')
    .replace(/subforced.*/i, '')
    .replace(/tnb.*/i, '')
    .replace(/torentz.*/i, '')
    .replace(/torent.*/i, '')
    .replace(/torrent.*/i, '')
    .replace(/web-dl.*/i, '')
    .replace(/webrip.*/i, '')
    .replace(/x264.*/i, '')
    .replace(/xvid.*/i, '')
    .replace(/yify.*/i, '')
    .trim() // remove all leading and trailing whitespace

  // Extract potential title strings.
  let titles = [ cleanName ]

  // Chop words off end of cleanName one by one to create alt title strings
  let choppedName = cleanName
  if (choppedName.lastIndexOf(' ') < 0) {
    // Split single word camelcase into separate words
    choppedName = choppedName.replace(/([a-z][A-Z])/g, '$1 $2')
    titles.push(choppedName) // push the split title onto potential titles
  }
  while (choppedName.lastIndexOf(' ') > -1) {
    choppedName = choppedName.substring(0, choppedName.lastIndexOf(' '))
    titles.push(choppedName)
  }

  // Conflate release year and title into query objects
  // Titles can also be considered standalone.
  let queries = []

  releaseYears.forEach((releaseYear) => {
    titles.forEach((title) => {
      queries.push({ title, releaseYear })
    })
  })

  titles.forEach((title) => {
    queries.push({ title })
  })

  // TODO: Look up movie title standards? E.g. are dashes allowed?

  // Consider parent directory name?
  // I.e. if movie file's directory has no subdirs AND has only 1 movie file,
  // then we should include the cleaned directory name in our search queries.

  return queries
}

// External API.
// Pass in the title of the movie and a completion callback.
// Callback is executed with (err, metadata) upon completion.
function fetchMovieMetadata (movieFile, callback) {
  const queries = getSearchQueriesFor(movieFile)
  fetchMovieMetadataInternal(movieFile, callback, queries, 0)
}

function fetchMovieMetadataInternal (movieFile, callback, queries, queryId) {
  // Look up metadata for this movie.
  fetchDataFor(queries[queryId], function () {
    const metadata = JSON.parse(this.responseText)

    let rating = '<<RATING>>'
    if (metadata.Ratings && metadata.Ratings.length > 0) {
      rating = metadata.Ratings[0].Value || rating
    }

    const { name } = path.parse(movieFile)

    const meta = {
      genre: metadata.Genre || '<<GENRE>>',
      imgSrc: metadata.Poster || '...',
      location: movieFile,
      plot: metadata.Plot || 'Could not find online data for this movie. Try editing filename.',
      rating: rating,
      title: metadata.Title || name,
      year: metadata.Year || '<<RELEASE YEAR>>'
    }

    // On error, try next query
    if (metadata.Error) {
      if ((queryId + 1) < queries.length) {
        fetchMovieMetadataInternal(movieFile, callback, queries, queryId + 1)
      } else {
        // Failure.
        callback(null, meta)
      }
    } else {
      // Success.
      callback(null, meta)
    }
  })
}

module.exports = {
  fetchMovieMetadata
}
