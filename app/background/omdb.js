// Movie metadata source API.
const BASE_URL = 'http://www.omdbapi.com/?plot=full&t='
const YEAR_PARAM = '&y='

module.exports = {
  convertQueriesToOMDBUrls: function convertQueriesToOMDBUrls (queries) {
    return queries.map((query) => {
      const year = (query.releaseYear) ? `${YEAR_PARAM}${query.releaseYear}` : ''
      const url = `${BASE_URL}${query.title}${year}`
      return encodeURI(url)
    })
  }
}
