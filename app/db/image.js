const path = require('path')
const request = require('../shared/request')
const { mkdir } = require('../shared/utils')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const IMAGE_PATH = `${APPDATA_PATH}/image`

module.exports = {

  downloadPosterFor: function downloadPosterFor (movie) {
    return mkdir(IMAGE_PATH)
      .then(() => {
        const { ext } = path.parse(movie.imgUrl)
        const fname = `${IMAGE_PATH}/${movie.imdbID}${ext}`
        return request.downloadFile(movie.imgUrl, fname).then(() => fname)
      })
  }
}
