const fs = require('fs')
const path = require('path')
const request = require('../shared/request')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const IMAGE_PATH = `${APPDATA_PATH}/image`

module.exports = {

  downloadPosterFor: function downloadPosterFor (movie) {
    return new Promise((resolve, reject) => {
      fs.mkdir(IMAGE_PATH, (err) => {
        if (err && err.code !== 'EEXIST') { // OK if directory already exists
          return reject(new Error(`Creating directory ${IMAGE_PATH} failed: ${err}`))
        }
        return request.get(movie.imgUrl)
          .then((responseData) => {
            const { ext } = path.parse(movie.imgUrl)
            const fname = `${IMAGE_PATH}/${movie.imdbID}${ext}`
            fs.writeFile(fname, responseData, 'binary', (err) => {
              if (err) {
                return reject(new Error(`Writing ${fname} failed: ${err}`))
              }

              resolve(fname) // SUCCESS!
            })
          })
      })
    })
  }
}
