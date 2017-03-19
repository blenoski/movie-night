const path = require('path')
const url = require('url')

const electron = require('electron')

const {
  SELECT_IMPORT_DIRECTORY,
  IMPORT_DIRECTORY,
  SEARCHING_DIRECTORY,
  MOVIE_FILES
} = require('../shared/Events')
const { isDevEnv, logEnv } = require('../shared/Utils')

const logger = require('./mainLogger')
logEnv(logger)

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Module to communicate with render and background process
const ipcMain = electron.ipcMain

// Keep a global reference of the window objects, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let backgroundWorker = null

function createWindows () {
  logger.info('Creating application mainWindow')

  // Get the usable screen size.
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  const initialWindowSizeScaleFactor = 0.95
  height = Math.round(height * initialWindowSizeScaleFactor)
  width = Math.round(width * initialWindowSizeScaleFactor)

  // Create the browser window.
  mainWindow = new BrowserWindow({width, height})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', '..', 'bundle', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools if we are in dev.
  if (isDevEnv()) {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    logger.info('Received mainWindow closed event')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null

    // For non OSX platforms, we should go ahead and
    // close the app when the mainWindow has been closed.
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Create the background window
  if (backgroundWorker === null) {
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
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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
  if (mainWindow === null) {
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
  const window = BrowserWindow.fromWebContents(event.sender)
  electron.dialog.showOpenDialog(window, {
    properties: ['openDirectory']
  }, function (selection) {
    if (selection && selection[0] && backgroundWorker) {
      backgroundWorker.webContents.send(IMPORT_DIRECTORY, selection[0])
    }
  })
})

// Handle SEARCHING_DIRECTORY events.
// Pass event through to mainWindow process.
ipcMain.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  if (mainWindow) {
    mainWindow.webContents.send(SEARCHING_DIRECTORY, directory)
    logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
  }
})

// Handle MOVIE_FILES events.
// Pass event through to mainWindow process.
ipcMain.on(MOVIE_FILES, function (event, movies) {
  logger.info('Received MOVIE_FILES event', { n: movies.length })
  if (mainWindow) {
    mainWindow.webContents.send(MOVIE_FILES, movies)
    logger.info('Sent MOVIE_FILES event', { n: movies.length })
  }
})
