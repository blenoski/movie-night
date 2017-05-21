const path = require('path')
const { posterImagePath } = require('../../config')
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
  // TODO: Television Series Handling
  // Look for 'Season' and a number in the parent directory (but not title) and use this to
  // prioritize type=series over movies. Could also look for patterns like: S4Ep01 in title?
  return omdb.fetchMovieMetadata(movieFile)
    .then(({metadata, url}) => {
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
      return metadata
    })
}
