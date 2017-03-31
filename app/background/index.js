const { ipcRenderer } = require('electron')
const {
  IMPORT_DIRECTORY,
  SEARCHING_DIRECTORY,
  MOVIE_FILES
} = require('../shared/events')
const { logEnv } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')
const { crawlForMovies } = require('./crawlForMovies')

logEnv(logger)

// Handle IMPORT_DIRECTORY events.
const handleImportDirectoryEvent = (event, rootDirectory) => {
  logger.info('Received IMPORT_DIRECTORY event', { rootDirectory })

  const searchDirCb = (directory) => {
    ipcRenderer.send(SEARCHING_DIRECTORY, directory)
    logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
  }

  const movies = crawlForMovies(rootDirectory, searchDirCb)
  ipcRenderer.send(MOVIE_FILES, movies, rootDirectory)
  logger.info('Sent MOVIE_FILES event', { n: movies.length, rootDirectory })
}

// Link IMPORT_DIRECTORY event to its event handler.
ipcRenderer.on(IMPORT_DIRECTORY, handleImportDirectoryEvent)
