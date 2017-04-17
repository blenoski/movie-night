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
  // Returns a promise with metadata on success.
  fetchMovieMetadata: function fetchMovieMetadata (movieFile) {
    return fetchMovieDataInternal(movieFile)
  }
}

function fetchMovieDataInternal (movieFile) {
  return new Promise(function (resolve, reject) {
    const queries = generateSearchQueriesFor(movieFile)
    let done = false

    // Loop over search queries in order and fetch metadata.
    // Stop on first successful query.
    return queries.reduce(function (sequence, query, index) {
      return sequence.then(function () { // waits for previous query to complete
        if (done) {
          return // this no-ops rest of promise chain
        }

        return fetchDataFor(query) // must return this async function so it gets added to chain
          .then((response) => {
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

            resolve(meta)
            done = true
          })
          .catch(function (err) {
            // On network or status error, reject immediately.
            if (err instanceof request.NetworkError || err instanceof request.StatusError) {
              logger.error('Request failed.', {movieFile, messsage: err.message, url: err.url})
              reject(err)
              done = true
            // If we are out of search queries, then reject.
            } else if ((index + 1) === queries.length) {
              logger.warn(`No data found for: ${movieFile}`, { queries })
              reject(err)
            }
          })
      })
    }, Promise.resolve())
  })
}

// Fetch metadata for the movie from the web.
// These requests are rate limited to prevent slamming the server and are
// asynchronous so we can process a movie as soon as we receive its metadata.
function fetchDataFor (query) {
  return new Promise((resolve, reject) => {
    limiter.removeTokens(1, function (err, remainingRequests) {
      if (err) {
        logger.error(err)
        reject(err)
      }

      const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
      const uri = `${OMDB_API}${query.title}${year}`
      const encodedUri = encodeURI(uri)

      request.getJSON(encodedUri)
        .then((data) => {
          if (data.Error) {
            throw new Error(data.Error)
          }
          resolve(data) // SUCCESS!
        })
        .catch((error) => reject(error))
    })
  })
}
