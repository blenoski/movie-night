const path = require('path')
const { RateLimiter } = require('limiter')
const logger = require('./backgroundWorkerLogger')

// Movie metadata source.
// Poster is a link to an external image.
const OMDB_API = 'http://www.omdbapi.com/?plot=full&t='

// We will limit our requests to a maximum of 40 per 10 seconds.
const milliseconds = 10 * 1000
let limiter = new RateLimiter(40, milliseconds)

// Fetch metadata for the movie from the web.
// These requests are rate limited to prevent slamming the server and are
// asynchronous so we can process a movie as soon as we receive its metadata.
function fetchDataFor (movie, cb) {
  limiter.removeTokens(1, function (err, remainingRequests) {
    if (err) {
      logger.error(err)
    }

    /* global XMLHttpRequest */
    var req = new XMLHttpRequest()
    req.addEventListener('load', cb)
    req.open('GET', `${OMDB_API}${movie}`)
    req.send()
  })
}

// Movie file names are often decorated with metadata that will cause
// online searches to fail. Try and strip out anything that looks like metadata.
function extractTitleFrom (movieFile) {
  // Extract the file name from the full path
  const { name } = path.parse(movieFile)

  // Delete anything that looks like metadata encoded in the title.
  // E.g. [1998], (2009), (D), [Meta], .2007.
  let title = name.replace(/\(.*?\)/g, '') // remove all text in parens incl. parens
    .replace(/\[.*?\]/g, '') // remove all text in brackets incl. brackets
    .replace(/.\d{4}./g, '') // remove year bracketed by periods incl. periods
    .trim() // remove all leading and trailing whitespace

  return title
}

// External API.
// Pass in the title of the movie and a completion callback.
// Callback is executed with (err, metadata) upon completion.
function fetchMovieMetadata (movieFile, cb) {
  const title = extractTitleFrom(movieFile)

  // Look up metadata for this movie.
  fetchDataFor(title, function () {
    const metadata = JSON.parse(this.responseText)

    let rating = '<<RATING>>'
    if (metadata.Ratings && metadata.Ratings.length > 0) {
      rating = metadata.Ratings[0].Value || rating
    }

    const meta = {
      genre: metadata.Genre || '<<GENRE>>',
      imgSrc: '...', // metadata.Poster || '...',
      plot: metadata.Plot || 'Could not find online data for this movie',
      rating: rating,
      title: metadata.Title || title,
      year: metadata.Year || '<<RELEASE YEAR>>'
    }

    cb(null, meta)
  })
}

module.exports = {
  fetchMovieMetadata
}
