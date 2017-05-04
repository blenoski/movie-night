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

    // TODO:
    // Refactor to use OMDB's seach API first, followed by the
    // metadata API with imdbID. Should ignore type=game on initial query.
    //
    // TODO: Television Series Handling
    // Look for 'Season' and a number in the parent directory (but not title) and use this to
    // prioritize type=series over movies. Could also look for patterns like: S4Ep01 in title?
    //
    // TODO:
    // Do not include year in title search if it is the last word
    // E.g. 'Star Trek 2009.avi'
    // But do not lose, e.g. '2012 (2009).avi'

    return request.getFirstSuccess(urls, omdb.dataValidator)
      .then(({data, url}) => {
        const metadata = omdb.transform(data)
        metadata.fileInfo = [{
          location: movieFile,
          query: url
        }]
        if (metadata.imgUrl) {
          const { ext } = path.parse(metadata.imgUrl)
          metadata.imgFile = path.join(posterImagePath, `${metadata.imdbID}${ext}`)
        } else {
          metadata.imgFile = ''
        }
        resolve(metadata)
      })
      .catch((err) => reject(err))
  })
}
