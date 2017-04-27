const request = require('../shared/request')
const { ExtendableError } = require('../shared/utils')

const BASE_URL = 'http://www.omdbapi.com/?plot=full&t='
const YEAR_PARAM = '&y='

module.exports = {
  convertQueriesToOMDBUrls: function convertQueriesToOMDBUrls (queries) {
    return queries.map((query) => {
      return getUrlFor(query)
    })
  },

  getJSON: function getJSON (query) {
    const url = getUrlFor(query)
    return request.getJSON(url, dataValidator)
  },

  // Transform the OMDB HTTP response into our internal
  // movie descriptor.
  transform: function tranform (response) {
    let rating = (response.Ratings && response.Ratings.length > 0)
      ? response.Ratings[0].Value || '<<RATING>>'
      : '<<RATING>>'

    const imgUrl = (response.Poster && response.Poster.startsWith('http'))
      ? response.Poster
      : ''

    return {
      actors: response.Actors || '<<ACTORS>>',
      genre: response.Genre || '<<GENRE>>',
      imdbID: response.imdbID || '',
      imgUrl: imgUrl,
      plot: response.Plot || '',
      rating: rating,
      title: response.Title || '<<TITLE>>',
      year: response.Year || '<<RELEASE YEAR>>'
    }
  },

  dataValidator
}

class OMDBDataError extends ExtendableError {}

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

function getUrlFor (query) {
  const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
  const url = `${BASE_URL}${query.title}${year}`
  return encodeURI(url)
}
