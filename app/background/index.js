const path = require('path')
const { ipcRenderer } = require('electron')
const {
  CRAWL_COMPLETE,
  IMPORT_DIRECTORY,
  MOVIE_METADATA,
  SEARCHING_DIRECTORY
} = require('../shared/events')
const { logEnv } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')
const { crawlForMovies } = require('./crawlForMovies')
const { fetchMovieMetadata } = require('./fetchMovieMetadata')

logEnv(logger)

// Called upon first ENTERING a new crawl directory
const searchDirCb = (directory) => {
  ipcRenderer.send(SEARCHING_DIRECTORY, directory)
  logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
}

// Called whenever a movie file is encountered during crawl.
const movieFileCb = (movieFile) => {
  fetchMovieMetadata(movieFile)
    .then((meta) => {
      ipcRenderer.send(MOVIE_METADATA, meta)
      logger.info('Sent MOVIE_METADATA event', { title: meta.title })
    })
    .catch((err) => {
      const { name } = path.parse(movieFile)
      const meta = {
        location: movieFile,
        plot: err.message,
        title: name
      }
      ipcRenderer.send(MOVIE_METADATA, meta)
      logger.info('Sent MOVIE_METADATA event', { title: meta.title })
    })
}

// Handler for IMPORT_DIRECTORY events.
const handleImportDirectoryEvent = (event, rootDirectory) => {
  logger.info('Received IMPORT_DIRECTORY event', { rootDirectory })

  crawlForMovies({rootDirectory, searchDirCb, movieFileCb})

  // TODO: do not send this message until crawl is complete
  ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
  logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
}

// Link IMPORT_DIRECTORY event to its event handler.
ipcRenderer.on(IMPORT_DIRECTORY, handleImportDirectoryEvent)
