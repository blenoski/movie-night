const { ipcRenderer } = require('electron')

const {
  ADD_MOVIE,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE
} = require('../shared/events')
const { logEnv } = require('../shared/utils')

const SingleCollectionDatabase = require('./database')
const logger = require('./dbLogger')
const { fetchMovieMetadata } = require('./fetchMovieMetadata')
const { checkIfPosterFileHasBeenDownloadedFor, downloadPosterFor } = require('./poster')

// Configuration.
// TODO: move this to a config module
const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = `${DB_PATH}/movieDB.json`

// Record environment.
logEnv(logger)

// Instantiate the database.
// This will use the existing database if it exists.
// Otherwise it will create a new database.
let db = new SingleCollectionDatabase({ dbPath: DB_PATH, uniqueField: 'imdbID', dbFile })
logger.info('Database config:', db.config())

// Conflate a new movie with existing database document.
// TODO: delegate this to a proper meta class, e.g., conflate method
// and do a full conflation
function conflate (document, movie) {
  // Early return if document is currently null, i.e., not in database.
  if (!document) {
    return { documentChanged: true, finalDocument: movie }
  }

  // Currently only checking for new locations
  const duplicateLocation = document.fileInfo.find((info) => {
    return info.location === movie.fileInfo[0].location
  })
  if (!duplicateLocation) {
    let finalDoc = JSON.parse(JSON.stringify(document))
    finalDoc.fileInfo.push(movie.fileInfo[0])
    return { documentChanged: true, finalDocument: finalDoc }
  } else {
    return { documentChanged: false, finalDocument: document }
  }
}

// HOF used in conjunction with db.findOne() to find a movie in the database
// matching the provided file.
function movieWithAnyLocationMatching (movieFile) {
  const filter = (document) => {
    for (let item of document.fileInfo) {
      if (item.location === movieFile) {
        return true
      }
    }
    return false
  }
  return filter
}

// Handler for ADD_MOVIE events.
ipcRenderer.on(ADD_MOVIE, (event, movieFile) => {
  logger.info('Received ADD_MOVIE event', { movie: movieFile })

  // Early exit if this movie file is already in the database.
  // const document = db.findByLocation(movieFile)
  const document = db.findOne(movieWithAnyLocationMatching(movieFile))
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
      let document = db.findByID(movie.imdbID)
      if (posterDownloaded && document && movie.imgUrl === document.imgUrl) {
        return {movie, document} // poster image is already good to go
      }
      return downloadPosterFor(movie).then(() => { return {movie, document} })
    })
    .then(({movie, document}) => {
      let {documentChanged, finalDocument} = conflate(document, movie)
      if (documentChanged) {
        let movieDB = db.addOrUpdate(finalDocument)
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
      .then(({posterDownloaded, movie}) => {
        if (!posterDownloaded) {
          downloadPosterFor(movie).then().catch()
        }
      })
  })
})

logger.info('initialization complete')
