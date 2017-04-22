const path = require('path')
const request = require('../shared/request')
const { generateSearchQueriesFor } = require('./generateSearchQueries')
const omdb = require('./omdb')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const IMAGE_PATH = `${APPDATA_PATH}/image`

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
        metadata.imgFile = `${IMAGE_PATH}/${metadata.imdbID}${ext}`
        resolve(metadata)
      })
      .catch((err) => reject(err))
  })
}
