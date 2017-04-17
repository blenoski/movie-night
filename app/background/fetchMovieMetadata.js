const path = require('path')
const { generateSearchQueriesFor } = require('./generateSearchQueries')
const request = require('./request')

// Movie metadata source API.
const OMDB_API = 'http://www.omdbapi.com/?plot=full&t='
const YEAR_PARAM = '&y='

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
    const urls = convertQueriesToUrls(queries)

    return request.getFirstSuccess(urls, validator)
      .then((response) => {
        let rating = '<<RATING>>'
        if (response.Ratings && response.Ratings.length > 0) {
          rating = response.Ratings[0].Value || rating
        }

        const { name } = path.parse(movieFile)
        let metadata = {
          genre: response.Genre || '<<GENRE>>',
          imgSrc: response.Poster || '...',
          location: movieFile,
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

//
function validator (data) {
  if (data.Error) {
    throw new Error(data.Error)
  }
}

//
function convertQueriesToUrls (queries) {
  return queries.map((query) => {
    const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
    const url = `${OMDB_API}${query.title}${year}`
    return encodeURI(url)
  })
}
