const path = require('path')
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
        let rating = '<<RATING>>'
        if (response.Ratings && response.Ratings.length > 0) {
          rating = response.Ratings[0].Value || rating
        }

        const { name } = path.parse(movieFile)
        let metadata = {
          genre: response.Genre || '<<GENRE>>',
          imdbID: response.imdbID || '',
          imgUrl: response.Poster || '',
          location: [ movieFile ],
          plot: response.Plot || '',
          rating: rating,
          title: response.Title || name,
          year: response.Year || '<<RELEASE YEAR>>'
        }

        resolve(metadata)
      })
      .catch((err) => reject(err))
  })
}
