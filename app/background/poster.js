const request = require('../shared/request')
const { mkdir, fileExists } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')

// TODO: get this from config module
const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const IMAGE_PATH = `${APPDATA_PATH}/image`

module.exports = {

  downloadPosterFor: function downloadPosterFor (movie) {
    return mkdir(IMAGE_PATH)
      .then(() => {
        return request.downloadFile(movie.imgUrl, movie.imgFile)
      })
      .then(() => {
        return movie
      })
      .catch((err) => {
        logger.error(`Downloading image failed for ${movie.title}`, err)
        return movie
      })
  },

  checkIfPosterFileHasBeenDownloadedFor: function checkIfPosterFileHasBeenDownloadedFor (movie) {
    return fileExists(movie.imgFile)
      .then((posterDownloaded) => {
        return {posterDownloaded, movie}
      })
  }
}
