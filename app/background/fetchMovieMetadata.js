const path = require('path')
const { RateLimiter } = require('limiter')
const logger = require('./backgroundWorkerLogger')
const { generateSearchQueriesFor } = require('./generateSearchQueries')
const request = require('./request')

// Movie metadata source API.
const OMDB_API = 'http://www.omdbapi.com/?plot=full&t='
const YEAR_PARAM = '&y='

// We will limit all network requests to a maximum of 40 per 10 seconds.
const period = 10 * 1000 // 10 seconds in millisecosnds
let limiter = new RateLimiter(40, period)

module.exports = {
  // External API.
  // Pass in the title of the movie and a completion callback.
  // Callback is executed with (err, metadata) upon completion.
  fetchMovieMetadata: function fetchMovieMetadata (movieFile, callback) {
    const queries = generateSearchQueriesFor(movieFile)
    fetchMovieDataRecursive(movieFile, callback, queries, 0)
  }
}

// Look up metadata for this movie.
// This is a recursive function. We will try the queries
// in order until we have a success or exhaust all queries.
function fetchMovieDataRecursive (movieFile, callback, queries, queryId) {
  fetchDataFor(queries[queryId], function (err, response) {
    if (err) {
      // STOP CONDITION: On network or status error, fail search immediately.
      if (err instanceof request.NetworkError || err instanceof request.StatusError) {
        logger.error('Request failed.', {movieFile, messsage: err.message, url: err.url})
        callback(err, null)
      // STOP CONDITION: If we are out of search queries, then end recursion.
      } else if ((queryId + 1) === queries.length) {
        logger.warn(`No data found for: ${movieFile}`, { queries })
        callback(err, null)
      } else {
        // RECURSION: try the next search query.
        fetchMovieDataRecursive(movieFile, callback, queries, queryId + 1)
      }
      return
    }

    // Handle Success!
    let rating = '<<RATING>>'
    if (response.Ratings && response.Ratings.length > 0) {
      rating = response.Ratings[0].Value || rating
    }

    const { name } = path.parse(movieFile)
    let meta = {
      genre: response.Genre || '<<GENRE>>',
      imgSrc: response.Poster || '...',
      location: movieFile,
      plot: response.Plot || '',
      rating: rating,
      title: response.Title || name,
      year: response.Year || '<<RELEASE YEAR>>'
    }

    callback(null, meta)
  })
}

// Fetch metadata for the movie from the web.
// These requests are rate limited to prevent slamming the server and are
// asynchronous so we can process a movie as soon as we receive its metadata.
function fetchDataFor (query, callback) {
  limiter.removeTokens(1, function (err, remainingRequests) {
    if (err) {
      logger.error(err)
    }

    const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
    const url = `${OMDB_API}${query.title}${year}`
    const encodedUrl = encodeURI(url)

    request.getJSON(encodedUrl)
      .then((data) => {
        if (data.Error) {
          throw new Error(data.Error)
        }
        callback(null, data)
      })
      .catch((error) => callback(error, null))
  })
}
