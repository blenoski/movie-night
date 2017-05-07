const request = require('../shared/request')
const { ExtendableError } = require('../shared/utils')
const { generateSearchQueriesFor } = require('./generateSearchQueries')

const BASE_URL = 'http://www.omdbapi.com/'

module.exports = {
  fetchMovieMetadata
}

class OMDBDataError extends ExtendableError {}

function fetchMovieMetadata (movieFile) {
  const queries = generateSearchQueriesFor(movieFile)
  const urls = convertQueriesToOMDBUrls(queries)
  let successUrl = ''
  return request.getFirstSuccess(urls, searchValidator)
    .then(({data, url}) => {
      successUrl = url

      // Get imdbID for first item that is not a game.
      const items = data.Search.filter(result => result.Type !== 'game')
      if (items.length === 0) {
        throw new Error('Movie not found, only games!') // programming error if this is caught here.
      }

      return getJSON(items[0].imdbID, dataValidator) // get the actual metadata
    })
    .then((data) => {
      const metadata = transform(data)
      return { metadata, url: successUrl }
    })
}

function convertQueriesToOMDBUrls (queries) {
  return queries.map((query) => {
    const year = (query.releaseYear) ? `&y=${query.releaseYear}` : ''
    const url = `${BASE_URL}?&s=${query.title}${year}`
    return encodeURI(url)
  })
}

function searchValidator (data) {
  if (data.Error) {
    throw new OMDBDataError(data.Error)
  }

  // Looking for one result that is not a game.
  const items = data.Search.filter(result => result.Type !== 'game')
  if (items.length === 0) {
    throw new OMDBDataError('Movie not found!')
  }
}

function getJSON (imdbID) {
  const url = `${BASE_URL}?plot=full&i=${imdbID}`
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
  const rating = (response.Ratings && response.Ratings.length > 0)
    ? response.Ratings[0].Value || '<<RATING>>'
    : '<<RATING>>'

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
    genres: genres,
    imdbID: response.imdbID || '',
    imgUrl: imgUrl,
    plot: response.Plot || '',
    rating: rating,
    title: response.Title || '<<TITLE>>',
    year: response.Year || '<<RELEASE YEAR>>'
  }
}
