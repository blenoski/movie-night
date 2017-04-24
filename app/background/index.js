const path = require('path')
const { ipcRenderer } = require('electron')

const { dbPath, dbName } = require('../../config')
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

// Database configuration.
const dbConfig = { uniqueField: 'imdbID', dbPath, dbName }

// Record environment.
logEnv(logger)

// =====================================
// Handle the LOAD_MOVIE_DATABASE events
// =====================================
ipcRenderer.on(LOAD_MOVIE_DATABASE, (event) => {
  logger.info('Received LOAD_MOVIE_DATABASE event')

  // Instantiate the database.
  // The loaded database should be garbage collected upon completion of handler.
  let db = new SingleCollectionDatabase(dbConfig)
  logger.info('Database config:', db.config())

  // Send the movie database
  let movieDB = db.getCollection()
  ipcRenderer.send(MOVIE_DATABASE, movieDB) // SUCCESS!
  logger.info('Sent MOVIE_DATABASE event', { count: movieDB.length })

  // Try to download any missing poster images
  movieDB.forEach((movie) => {
    checkIfPosterHasBeenDownloadedFor(movie)
      .then(({posterDownloaded, movie}) => {
        if (!posterDownloaded && movie.imgUrl) {
          downloadPosterFor(movie).then().catch()
        }
      })
  })
})

// ===================================
// Handler for CRAWL_DIRECTORY events.
// ===================================
ipcRenderer.on(CRAWL_DIRECTORY, (event, rootDirectory) => {
  logger.info('Received CRAWL_DIRECTORY event', { rootDirectory })

  // Instantiate the database.
  // The loaded database should get garbage collected upon completion of handler.
  let db = new SingleCollectionDatabase(dbConfig)
  logger.info('Database config:', db.config())

  // As we discover movie files during the crawl, we will push Promises
  // onto this array where each Promise represents the work of downloading the
  // metadata for a single movie. When the crawl is complete, we can then
  // sequentially wait on each Promise in the array using reduce. When the last
  // Promise has completed we are finished. Note that this does not prevent the
  // Promises from running in parallel.
  let moviesInProgress = []

  const movieFileCb = (movieFile) => {
    // Check blacklist
    const { name } = path.parse(movieFile)
    if (name === 'sample') { // e.g. sample.avi
      logger.info(`Skipping blacklisted title: ${movieFile}`)
      return
    }

    logger.info('Found', { movieFile })
    moviesInProgress.push(addMovie(movieFile, db))
  }

  crawlForMovies({rootDirectory, searchDirCb, movieFileCb})
    .then(() => {
      // Wait for all movies to finish processing before
      // returning from crawl
      return moviesInProgress.reduce((prev, curr) => {
        return prev.then(() => {
          return curr.then(({err, movieFile}) => {
            if (err) {
              logger.warn(`${movieFile} not added to database:`, { type: err.name, message: err.message })
              // TODO: send a data not found event to appWindow?
            } else {
              logger.info(`Completed processing ${movieFile}`)
            }
          })
        })
      }, Promise.resolve())
    })
    .then(() => {
      ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
      logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
    })
})

// Called upon ENTERING a new crawl directory
const searchDirCb = (directory) => {
  ipcRenderer.send(SEARCHING_DIRECTORY, directory)
  logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
}

// Called whenever a movie file is encountered during crawl.
function addMovie (movieFile, db) {
  return new Promise((resolve, reject) => {
    // Early exit if this movie file is already in the database.
    const document = db.findOne(movieWithAnyLocationMatching(movieFile))
    if (document) {
      logger.info(`Database has existing record for ${movieFile}`, {
        title: document.title,
        imdbID: document.imdbID
      })
      return resolve({err: null, movieFile})
    }

    return fetchMovieMetadata(movieFile)
      .then((movie) => {
        return checkIfPosterHasBeenDownloadedFor(movie)
      })
      .then(({posterDownloaded, movie}) => {
        let document = db.findByID(movie.imdbID)
        if (posterDownloaded && document && movie.imgUrl === document.imgUrl) {
          return {movie, document} // poster image is already good to go
        } else if (!movie.imgUrl) {
          return {movie, document} // there is no poster to download
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
        return resolve({err: null, movieFile})
      })
      .catch((error) => {
        return resolve({err: error, movieFile})
      })
  })
}

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
