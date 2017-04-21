const { ipcRenderer } = require('electron')
const {
  ADD_MOVIE,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE
} = require('../shared/events')
const { logEnv } = require('../shared/utils')
const db = require('./database')
const logger = require('./dbLogger')
const { downloadPosterFor } = require('./image')

// Handler for ADD_MOVIE events.
ipcRenderer.on(ADD_MOVIE, (event, movie) => {
  logger.info('Received ADD_MOVIE event', { title: movie.title })

  if (!movie.imdbID) {
    logger.error(`Missing required imdbID for`, { movie })
    return
  }

  // TODO: only download image if it is missing or the URL has changed
  // TODO: batch database updates
  // TODO: index on full (partial?) filename and only query new files.
  // TODO: sort DB by imbdID, then make find a binary search?

  downloadPosterFor(movie)
    .then((imgFile) => {
      return imgFile
    }, (err) => {
      logger.error(`Downloading image failed for ${movie.title}`, err)
      return '' // Swallow error.  Images are preferred but not required
    })
    .then((imgFile) => {
      movie.imgFile = imgFile
      let movieDB = db.addOrUpdateMovie(movie)
      if (movieDB.length > 0) {
        ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
        logger.info('Sent MOVIE_DATABASE event with new movie', { title: movie.title, count: movieDB.length })
      }
    })
    .catch(err => logger.error(`${movie.title} not added to database: ${err}`))
})

// LOAD_MOVIE_DATABASE
ipcRenderer.on(LOAD_MOVIE_DATABASE, (event) => {
  logger.info('Received LOAD_MOVIE_DATABASE event')
  let movieDB = db.loadDatabase()
  ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
  logger.info('Sent MOVIE_DATABASE event', { count: movieDB.length })
})

// Records environment AND indicates that initialization is complete.
logEnv(logger)
