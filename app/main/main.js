const path = require('path')
const url = require('url')

const electron = require('electron')

const {
  CRAWL_COMPLETE,
  CRAWL_DIRECTORY,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY
} = require('../shared/events')
const { isDevEnv, logEnv } = require('../shared/utils')

const logger = require('./mainLogger')
logEnv(logger)

// Module to control application life.
const app = electron.app

// Module to create native browser window processes.
const BrowserWindow = electron.BrowserWindow

// Module to communicate with render and background process
const ipcMain = electron.ipcMain

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let appWindow = null
let backgroundWorker = null

function createWindows () {
  logger.info('Creating application appWindow')

  // Get the usable screen size.
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  const initialWindowSizeScaleFactor = 0.95

  const maxInitialSize = 980
  const minHeight = 510
  height = Math.round(height * initialWindowSizeScaleFactor)
  height = Math.max(minHeight, Math.min(maxInitialSize, height))

  const minWidth = 510
  width = Math.round(width * initialWindowSizeScaleFactor)
  width = Math.max(minWidth, Math.min(maxInitialSize, width))

  // Create the browser window.
  appWindow = new BrowserWindow({
    height,
    minHeight,
    minWidth,
    width
  })

  // and load the index.html of the app.
  appWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', '..', 'bundle', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools if we are in dev.
  if (isDevEnv()) {
    appWindow.webContents.openDevTools()
  }

  // Emitted when the appWindow is closed.
  appWindow.on('closed', function () {
    logger.info('Received appWindow closed event')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    appWindow = null

    // For non OSX platforms, we should go ahead and
    // close the app when the appWindow has been closed.
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Create the backgroundWorker only after the appWindow is ready.
  // This event will also fire when the appWindow finishes reloading.
  appWindow.webContents.on('did-finish-load', () => {
    logger.info('Received appWindow did-finish-load event')

    const loadMovieDatabase = () => {
      backgroundWorker.webContents.send(LOAD_MOVIE_DATABASE)
      logger.info('Sent LOAD_MOVIE_DATABASE event to backgroundWorker')
    }

    if (backgroundWorker !== null) {
      loadMovieDatabase()
    } else {
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
        loadMovieDatabase()
      })
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used AFTER this event occurs.
app.on('ready', createWindows)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  logger.info('Received window-all-closed event')
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  logger.info('Received activate event')
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (appWindow === null) {
    createWindows()
  }
})

app.on('quit', function () {
  logger.info('Quitting app')
})

// Handle SELECT_IMPORT_DIRECTORY events.
// Open a native select directory file dialog. When user
// makes selection, delegate to backgroundWorker process
// to crawl for movies.
ipcMain.on(SELECT_IMPORT_DIRECTORY, function (event) {
  logger.info('Received SELECT_IMPORT_DIRECTORY event')
  const hint = 'SELECT MEDIA FOLDER'
  const window = BrowserWindow.fromWebContents(event.sender)
  electron.dialog.showOpenDialog(window, {
    title: hint,
    message: hint,
    buttonLabel: 'Add Media',
    properties: ['openDirectory']
  }, function (selection) {
    if (!backgroundWorker) {
      logger.error('backgroundWorker object does not exist')
    } else if (selection && selection[0]) {
      const directory = selection[0]
      backgroundWorker.webContents.send(CRAWL_DIRECTORY, directory)
      logger.info('Sent CRAWL_DIRECTORY event to bgWorker', { directory })
    } else {
      logger.info('User canceled directory file dialog')
      backgroundWorker.webContents.send(LOAD_MOVIE_DATABASE)
    }
  })
})

// Handle SEARCHING_DIRECTORY events.
// Pass event through to appWindow process.
ipcMain.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  if (appWindow) {
    appWindow.webContents.send(SEARCHING_DIRECTORY, directory)
    logger.debug('Sent SEARCHING_DIRECTORY event to appWindow', { directory })
  } else {
    logger.error('appWindow object does not exist')
  }
})

// Handle CRAWL_COMPLETE events.
// Pass event through to appWindow process.
ipcMain.on(CRAWL_COMPLETE, function (event, directory) {
  logger.info('Received CRAWL_COMPLETE event', { directory })
  if (appWindow) {
    appWindow.webContents.send(CRAWL_COMPLETE, directory)
    logger.info('Sent CRAWL_COMPLETE event to appWindow', { directory })
  } else {
    logger.error('appWindow object does not exist')
  }
})

// Handle MOVIE_DB events.
// Route to appWindow
ipcMain.on(MOVIE_DATABASE, function (event, movieDB) {
  logger.info('Received MOVIE_DATABASE event', { count: movieDB.length })
  if (appWindow) {
    appWindow.webContents.send(MOVIE_DATABASE, movieDB)
    logger.info('Sent MOVIE_DATABASE event to appWindow', { count: movieDB.length })
  } else {
    logger.error('appWindow object does not exist')
  }
})
