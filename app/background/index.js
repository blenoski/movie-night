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

// Handle IMPORT_DIRECTORY events.
const handleImportDirectoryEvent = (event, rootDirectory) => {
  logger.info('Received IMPORT_DIRECTORY event', { rootDirectory })

  const searchDirCb = (directory) => {
    ipcRenderer.send(SEARCHING_DIRECTORY, directory)
    logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
  }

  const movieFileCb = (movieFile) => {
    fetchMovieMetadata(movieFile, (err, meta) => {
      if (err) {
        logger.error(err, { movieFile })
      }

      ipcRenderer.send(MOVIE_METADATA, meta)
      logger.info('Sent MOVIE_METADATA event', { title: meta.title })
    })
  }

  crawlForMovies(rootDirectory, searchDirCb, movieFileCb)

  // TODO: do not send this message until crawl is complete
  ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
  logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
}

// Link IMPORT_DIRECTORY event to its event handler.
ipcRenderer.on(IMPORT_DIRECTORY, handleImportDirectoryEvent)
