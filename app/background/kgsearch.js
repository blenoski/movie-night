const request = require('./request')

const API_KEY = process.env.GOOGLE_KGSEARCH_API_KEY
const BASE_URL = 'https://kgsearch.googleapis.com/v1/entities:search'
const QUERY = `?types=Movie&limit=1&key=${API_KEY}&query=`

module.exports = {
  convertQueriesToKGSearchUrls: function convertQueriesToKGSearchUrls (queries) {
    return queries.map((query) => {
      return getUrlFor(query)
    })
  },

  getJSON: function getJSON (query) {
    const url = getUrlFor(query)
    const dataValidator = (data) => {
      if (data.itemListElement.length === 0) {
        throw new Error(`No data for ${url}`)
      }
    }

    return request.getJSON(url, dataValidator)
  }
}

function getUrlFor (query) {
  const year = (query.releaseYear) ? `[${query.releaseYear}]` : ''
  const url = `${BASE_URL}${QUERY}${query.title}${year}`
  return encodeURI(url)
}
