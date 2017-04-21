const { ipcRenderer } = require('electron')
const {
  ADD_MOVIE,
  CRAWL_COMPLETE,
  CRAWL_DIRECTORY,
  SEARCHING_DIRECTORY
} = require('../shared/events')
const { logEnv } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')
const { crawlForMovies } = require('./crawlForMovies')

// Called upon ENTERING a new crawl directory
const searchDirCb = (directory) => {
  ipcRenderer.send(SEARCHING_DIRECTORY, directory)
  logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
}

// Called whenever a movie file is encountered during crawl.
const movieFileCb = (movieFile) => {
  ipcRenderer.send(ADD_MOVIE, movieFile)
  logger.info('Sent ADD_MOVIE event', { movie: movieFile })
}

// Handler for CRAWL_DIRECTORY events.
ipcRenderer.on(CRAWL_DIRECTORY, (event, rootDirectory) => {
  logger.info('Received CRAWL_DIRECTORY event', { rootDirectory })

  crawlForMovies({rootDirectory, searchDirCb, movieFileCb})
    .then(() => {
      ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
      logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
    })
})

// Records environment AND indicates that initialization is complete.
logEnv(logger)
