const request = require('../shared/request')
const { posterImagePath } = require('../../config')
const { mkdir, fileExists } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')

module.exports = {

  downloadPosterFor: function downloadPosterFor (movie) {
    return mkdir(posterImagePath)
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

  checkIfPosterHasBeenDownloadedFor: function checkIfPosterHasBeenDownloadedFor (movie) {
    return fileExists(movie.imgFile)
      .then((posterDownloaded) => {
        return {posterDownloaded, movie}
      })
  }
}
