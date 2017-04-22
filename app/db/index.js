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
const { checkIfPosterFileHasBeenDownloadedFor, downloadPosterFor } = require('./poster')

// Handler for ADD_MOVIE events.
ipcRenderer.on(ADD_MOVIE, (event, movieFile) => {
  logger.info('Received ADD_MOVIE event', { movie: movieFile })

  // Early exit if this movie file is already in the database.
  const document = db.findByLocation(movieFile)
  if (document) {
    logger.info(`Database has existing record for ${movieFile}`, {
      title: document.title,
      imdbID: document.imdbID
    })
    return
  }

  fetchMovieMetadata(movieFile)
    .then((movie) => {
      return checkIfPosterFileHasBeenDownloadedFor(movie)
    })
    .then(({posterDownloaded, movie}) => {
      let document = null
      if (posterDownloaded) {
        document = db.findByID(movie.imdbID)
        if (document && movie.imgUrl === document.imgUrl) {
          return {movie, document} // poster image is already good to go
        }
      }
      return downloadPosterFor(movie).then(() => { return {movie, document} })
    })
    .then(({movie, document}) => {
      // TODO: do document conflation here and not in DB
      let movieDB = db.addOrUpdateMovie(movie)
      if (movieDB.length > 0) {
        ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
        logger.info('Sent MOVIE_DATABASE event with new movie', { title: movie.title, count: movieDB.length })
      }
    })
    .catch((err) => {
      logger.warn(`${movieFile} not added to database:`, { type: err.name, message: err.message })
      // TODO: send an data not found event to appWindow?
    })
})

// Handle the LOAD_MOVIE_DATABASE event called once at startup.
ipcRenderer.once(LOAD_MOVIE_DATABASE, (event) => {
  logger.info('Received LOAD_MOVIE_DATABASE event')
  let movieDB = db.loadDatabase()
  ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
  logger.info('Sent MOVIE_DATABASE event', { count: movieDB.length })

  // Try to download any missing poster images
  movieDB.forEach((movie) => {
    checkIfPosterFileHasBeenDownloadedFor(movie)
      .then((posterDownloaded) => {
        if (!posterDownloaded) {
          downloadPosterFor(movie).then().catch()
        }
      })
  })
})

// Records environment AND indicates that initialization is complete.
logEnv(logger)
