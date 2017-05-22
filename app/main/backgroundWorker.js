const path = require('path')
const url = require('url')
const { BrowserWindow } = require('electron')
const {
  CRAWL_DIRECTORY,
  LOAD_MOVIE_DATABASE
} = require('../shared/events')
const { isDevEnv } = require('../shared/utils')
const logger = require('./mainLogger')

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let backgroundWorker = null

function createBackgroundWindow (didFinishLoadCallback) {
  logger.info('Creating backgroundWorker')
  backgroundWorker = new BrowserWindow({show: isDevEnv()})
  backgroundWorker.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'background', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (isDevEnv()) {
    backgroundWorker.webContents.openDevTools()
  }

  backgroundWorker.webContents.on('did-finish-load', () => {
    didFinishLoadCallback()
  })
}

// Triggers the load movie database workflow.
// This also lazily creates the backgroundWorker.
function loadMovieDatabase () {
  if (!backgroundWorker) {
    createBackgroundWindow(loadMovieDatabase)
  } else {
    backgroundWorker.webContents.send(LOAD_MOVIE_DATABASE)
    logger.info('Sent LOAD_MOVIE_DATABASE event to backgroundWorker')
  }
}

// Triggers the import media workflow.
function handleCrawlDirectorySelectionEvent (selection) {
  if (!backgroundWorker) {
    logger.error('backgroundWorker object does not exist')
  } else if (selection && selection[0]) {
    const directory = selection[0]
    backgroundWorker.webContents.send(CRAWL_DIRECTORY, directory)
    logger.info('Sent CRAWL_DIRECTORY event to bgWorker', { directory })
  } else {
    logger.info('User canceled directory file dialog')
  }
}

module.exports = {
  createBackgroundWindow,
  handleCrawlDirectorySelectionEvent,
  loadMovieDatabase
}