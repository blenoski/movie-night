const request = require('./request')

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

  dataValidator
}

function dataValidator (data) {
  if (data.Error) {
    throw new Error(data.Error)
  }
}

function getUrlFor (query) {
  const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
  const url = `${BASE_URL}${query.title}${year}`
  return encodeURI(url)
}
