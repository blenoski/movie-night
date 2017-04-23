const { ipcRenderer } = require('electron')

const {
  CRAWL_COMPLETE,
  CRAWL_DIRECTORY,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} = require('../shared/events')
const { logEnv } = require('../shared/utils')

const logger = require('./backgroundWorkerLogger')
const { crawlForMovies } = require('./crawlForMovies')
const SingleCollectionDatabase = require('./database')
const { fetchMovieMetadata } = require('./fetchMovieMetadata')
const { checkIfPosterHasBeenDownloadedFor, downloadPosterFor } = require('./poster')

// Configuration.
// TODO: move this to a config module
const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = 'movieDB.json'

// Record environment.
logEnv(logger)

// Instantiate the database.
let db = new SingleCollectionDatabase({ dbPath: DB_PATH, uniqueField: 'imdbID', dbFile })
logger.info('Database config:', db.config())

// Called upon ENTERING a new crawl directory
const searchDirCb = (directory) => {
  ipcRenderer.send(SEARCHING_DIRECTORY, directory)
  logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
}

// Handler for CRAWL_DIRECTORY events.
ipcRenderer.on(CRAWL_DIRECTORY, (event, rootDirectory) => {
  logger.info('Received CRAWL_DIRECTORY event', { rootDirectory })

  crawlForMovies({rootDirectory, searchDirCb, movieFileCb})
    .then(() => {
      // TODO: wait for all movies to finish processing
      ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
      logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
    })
})

// Called whenever a movie file is encountered during crawl.
function movieFileCb (movieFile) {
  logger.info('Found', { movie: movieFile })

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
      return checkIfPosterHasBeenDownloadedFor(movie)
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
}

// Handle the LOAD_MOVIE_DATABASE event called once at startup.
ipcRenderer.once(LOAD_MOVIE_DATABASE, (event) => {
  logger.info('Received LOAD_MOVIE_DATABASE event')
  let movieDB = db.getCollection()
  ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
  logger.info('Sent MOVIE_DATABASE event', { count: movieDB.length })

  // Try to download any missing poster images
  movieDB.forEach((movie) => {
    checkIfPosterHasBeenDownloadedFor(movie)
      .then(({posterDownloaded, movie}) => {
        if (!posterDownloaded) {
          downloadPosterFor(movie).then().catch()
        }
      })
  })
})

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

logger.info('initialization complete')
