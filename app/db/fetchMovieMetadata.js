const { generateSearchQueriesFor } = require('./generateSearchQueries')
const omdb = require('./omdb')
const request = require('../shared/request')

module.exports = {
  // External API.
  // Pass in the title of the movie.
  // Returns a promise with metadata on success.
  fetchMovieMetadata: function fetchMovieMetadata (movieFile) {
    return fetchMovieDataInternal(movieFile)
  }
}

function fetchMovieDataInternal (movieFile) {
  return new Promise((resolve, reject) => {
    const queries = generateSearchQueriesFor(movieFile)
    const urls = omdb.convertQueriesToOMDBUrls(queries)

    return request.getFirstSuccess(urls, omdb.dataValidator)
      .then((response) => {
        const metadata = omdb.transform(response)
        metadata.location = [ movieFile ]
        resolve(metadata)
      })
      .catch((err) => reject(err))
  })
}
