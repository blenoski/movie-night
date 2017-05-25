const path = require('path')
const { ipcRenderer } = require('electron')
const _ = require('underscore')

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

// Throttle
const throttleDuration = process.env.NODE_ENV === 'test' ? 0 : 250

// Record environment.
logEnv(logger)

// =====================================
// Handle the LOAD_MOVIE_DATABASE events
// =====================================
ipcRenderer.on(LOAD_MOVIE_DATABASE, handleLoadMovieDatabaseEvent)
function handleLoadMovieDatabaseEvent (event) {
  logger.info('Received LOAD_MOVIE_DATABASE event')

  // Instantiate the database.
  // The loaded database should be garbage collected upon completion of handler.
  let db = new SingleCollectionDatabase(dbConfig)
  logger.info('Database config:', db.config())

  // Send the movie database
  const movieDB = db.getCollection()
  const sortedDB = paritionMovieDatabaseByGenre(movieDB)
  ipcRenderer.send(MOVIE_DATABASE, sortedDB) // SUCCESS!
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
}

// ===================================
// Handler for CRAWL_DIRECTORY events.
// ===================================
ipcRenderer.on(CRAWL_DIRECTORY, handleCrawlDirectoryEvent)
function handleCrawlDirectoryEvent (event, rootDirectory) {
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
    if (['sample', 'test footage'].find(item => item === name.toLowerCase())) { // e.g. sample.avi
      logger.info(`Skipping blacklisted title: ${movieFile}`)
      return
    }

    logger.info('Found', { movieFile })
    moviesInProgress.push(addMovie(movieFile, db))
  }

  return crawlForMovies({rootDirectory, searchDirCb, movieFileCb})
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
              logger.debug(`Completed processing ${movieFile}`)
            }
          })
        })
      }, Promise.resolve())
    })
    .then(() => {
      // Let the throttled database updates finish.
      setTimeout(() => {
        ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
        logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
      }, throttleDuration)
    })
}

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
          db.addOrUpdate(finalDocument)
          throttledSendMovieDatabase(db) // SUCCESS!!!
        }
        return resolve({err: null, movieFile})
      })
      .catch((error) => {
        return resolve({err: error, movieFile})
      })
  })
}

// Batch sending of movie database updates.
const throttledSendMovieDatabase = _.debounce(sendMovieDatabase, throttleDuration)
function sendMovieDatabase (db) {
  const movieDB = db.getCollection()
  const sortedDB = paritionMovieDatabaseByGenre(movieDB)
  ipcRenderer.send(MOVIE_DATABASE, sortedDB)
  logger.info('Sent MOVIE_DATABASE event', {
    count: sortedDB.reduce((sum, genre) => sum + genre.movies.length, 0)
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

// This function partitions movies by primary Genre and sorts the
// partitions from most to least movies.
function paritionMovieDatabaseByGenre (movieDB) {
  // Partition movies by primary genre.
  const genreMap = _.groupBy(movieDB, (movie) => movie.genres[0])
  return Object.keys(genreMap).map(genre => {
    return { // Move movies with no poster image to back of genre array.
      genre,
      movies: _.flatten(_.partition(genreMap[genre], (movie) => movie.imgFile))
    }
  }).sort((lhs, rhs) => { // sort by genre from most movies to least movies
    return rhs.movies.length - lhs.movies.length
  })
}

logger.info('initialization complete')

module.exports = {
  handleCrawlDirectoryEvent,
  handleLoadMovieDatabaseEvent,
  movieWithAnyLocationMatching,
  conflate,
  paritionMovieDatabaseByGenre
}
