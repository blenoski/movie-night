const path = require('path')
const { posterImagePath } = require('../../config')
const request = require('../shared/request')
const { generateSearchQueriesFor } = require('./generateSearchQueries')
const omdb = require('./omdb')

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
      .then(({data, url}) => {
        const metadata = omdb.transform(data)
        metadata.fileInfo = [{
          location: movieFile,
          query: url
        }]
        const { ext } = path.parse(metadata.imgUrl)
        metadata.imgFile = path.join(posterImagePath, `${metadata.imdbID}${ext}`)
        resolve(metadata)
      })
      .catch((err) => reject(err))
  })
}
