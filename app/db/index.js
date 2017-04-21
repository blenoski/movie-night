const { ipcRenderer } = require('electron')

const {
  ADD_MOVIE,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE
} = require('../shared/events')
const { logEnv } = require('../shared/utils')

const db = require('./database')
const logger = require('./dbLogger')
const { fetchMovieMetadata } = require('./fetchMovieMetadata')
const { downloadPosterFor } = require('./image')

// Handler for ADD_MOVIE events.
ipcRenderer.on(ADD_MOVIE, (event, movieFile) => {
  logger.info('Received ADD_MOVIE event', { movie: movieFile })

  // TODO: only download image if it is missing or the URL has changed
  // TODO: batch database updates
  // TODO: index on full (partial?) filename and only query new files.
  fetchMovieMetadata(movieFile)
    .then((movie) => {
      return downloadPosterFor(movie)
    })
    .then((movie) => {
      let movieDB = db.addOrUpdateMovie(movie)
      if (movieDB.length > 0) {
        ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
        logger.info('Sent MOVIE_DATABASE event with new movie', { title: movie.title, count: movieDB.length })
      }
    })
    .catch((err) => {
      logger.warn(`${movieFile} not added to database:`, { type: err.name, message: err.message })
      // TODO: send an error event?
      // TODO: verify that promise chain ends here
    })
})

// Handle the LOAD_MOVIE_DATABASE event called once at startup.
ipcRenderer.once(LOAD_MOVIE_DATABASE, (event) => {
  logger.info('Received LOAD_MOVIE_DATABASE event')
  let movieDB = db.loadDatabase()
  ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
  logger.info('Sent MOVIE_DATABASE event', { count: movieDB.length })
})

// Records environment AND indicates that initialization is complete.
logEnv(logger)
