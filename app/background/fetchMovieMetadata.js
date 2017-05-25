const path = require('path')
const { posterImagePath } = require('../../config')
const request = require('../shared/request')
const BASE_URL = 'https://us-central1-test-firebase-functions-82b96.cloudfunctions.net/getMovieMetadata'

module.exports = {
  // External API.
  // Pass in the title of the movie.
  // Returns a promise with metadata on success.
  fetchMovieMetadata: function fetchMovieMetadata (movieFile) {
    return fetchMovieDataInternal(movieFile)
  }
}

// TODO: Television Series Handling
// Look for 'Season' and a number in the parent directory (but not title) and use this to
// prioritize type=series over movies. Could also look for patterns like: S4Ep01 in title?

const dataValidator = (data) => {
  if (data.error) {
    throw new Error(data.message)
  }
}

function fetchMovieDataInternal (movieFile) {
  const url = `${BASE_URL}?file=${encodeURIComponent(movieFile)}`
  return request.getJSON(url, dataValidator)
    .then((metadata) => {
      metadata.fileInfo = [{
        location: movieFile,
        query: metadata.successQuery
      }]
      if (metadata.imgUrl) {
        const { ext } = path.parse(metadata.imgUrl)
        metadata.imgFile = path.join(posterImagePath, `${metadata.imdbID}${ext}`)
      } else {
        metadata.imgFile = ''
      }
      return metadata
    })
}
