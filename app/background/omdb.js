const request = require('../shared/request')
const { ExtendableError } = require('../shared/utils')
const { generateSearchQueriesFor } = require('./generateSearchQueries')

const OMDB_API_KEY = process.env.OMDB_API_KEY
const BASE_URL = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}`
class OMDBDataError extends ExtendableError {}

module.exports = {
  fetchMovieMetadata,
  test: {
    OMDBDataError
  }
}

function fetchMovieMetadata (movieFile) {
  const queries = generateSearchQueriesFor(movieFile)
  const urls = convertQueriesToOMDBUrls(queries)
  return omdbFetch(urls)
}

function omdbFetch (urls) {
  let successUrl = ''
  return request.getFirstSuccess(urls, searchValidator)
    .then(({data, url}) => {
      successUrl = url
      const movie = data.Search.find(result => result.Type !== 'game')
      return getJSON(movie.imdbID, dataValidator) // get actual metadata
    })
    .then((data) => {
      const metadata = transform(data)
      return { metadata, url: successUrl }
    }, (err) => {
      // Handle case where search query is successful but metadata query fails.
      // What we want to do is try again starting with the remaining URLs.
      const badIndex = urls.indexOf(successUrl)
      const remainingUrls = urls.filter((url, index) => {
        return index > badIndex
      })
      if (badIndex < 0 || remainingUrls.length === 0) {
        throw err
      }
      return omdbFetch(remainingUrls) // RECURSIVE!!!
    })
}

function convertQueriesToOMDBUrls (queries) {
  return queries.map((query) => {
    const year = (query.releaseYear) ? `&y=${query.releaseYear}` : ''
    const url = `${BASE_URL}&s=${query.title}${year}`
    return encodeURI(url)
  })
}

function searchValidator (data) {
  if (data.Error) {
    throw new OMDBDataError(data.Error)
  }

  // Looking for one result that is not a game.
  if (data.Search.findIndex(result => result.Type !== 'game') < 0) {
    throw new OMDBDataError('Movie not found!')
  }
}

function getJSON (imdbID) {
  const url = `${BASE_URL}&plot=short&i=${imdbID}`
  return request.getJSON(url, dataValidator)
}

function dataValidator (data) {
  if (data.Error) {
    throw new OMDBDataError(data.Error)
  }

  // Movies with genre "Short" or "Adult" are a common source of
  // false positives with OMDB's search results. We will reject such results
  // in this app with the tradeoff being we would never correctly identify
  // a Short or Adult film.
  if (data.Genre) {
    ['Short', 'Adult'].forEach((blacklistedGenre) => {
      if (data.Genre.indexOf(blacklistedGenre) >= 0) {
        throw new OMDBDataError(`Rejecting match with genre=${blacklistedGenre}`)
      }
    })
  }
}

// Transform the OMDB HTTP response into our internal movie descriptor.
function transform (response) {
  const imgUrl = (response.Poster && response.Poster.startsWith('http'))
    ? response.Poster
    : ''

  const genres = (response.Genre)
    ? response.Genre.split(',').map(e => e.trim().toLowerCase())
    : ['<<GENRE>>']

  const actors = (response.Actors)
    ? response.Actors.split(',').map(e => e.trim().toLowerCase())
    : ['<<ACTOR>>']

  return {
    actors: actors,
    director: response.Director || '',
    genres: genres,
    imdbID: response.imdbID || '',
    imdbRating: response.imdbRating || '',
    imgUrl: imgUrl,
    metascore: response.Metascore || '',
    plot: response.Plot || '',
    rated: response.Rated || '<<RATED>>',
    runtime: response.Runtime || '',
    title: response.Title || '<<TITLE>>',
    year: response.Year || '<<RELEASE YEAR>>'
  }
}
