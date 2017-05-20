// Electron modules must be run in an an electron process. Jest runs
// in a node process.  Thus, we will mock out the Electron modules here.
// https://facebook.github.io/jest/docs/manual-mocks.html
'use strict'

// To facilitate testing event handling, we will replace
// every BrowserWindow.send call with this mock.
// Inspecting the last call of the mock after calling an event handler
// can be used to *** almost *** verify expected behavior.
// However, we still will not know which BrowserWindow sent the call.
const sendMock = jest.genMockFunction()

// Mock the various electron components
const app = {
  on: jest.genMockFunction()
}

class BrowserWindow {
  constructor () {
    this.mock = jest.fn() /* globals jest */
    this.webContents = {
      on: jest.genMockFunction(),
      send: sendMock
    }
  }

  loadURL (...args) { this.mock(...args) }
  once (...args) { this.mock(...args) }
  on (...args) { this.mock(...args) }
  static fromWebContents () { return 'test' }
}

const dialog = {
  showOpenDialog: jest.genMockFunction()
}

const ipcMain = {
  on: jest.genMockFunction()
}

const ipcRenderer = {
  on: jest.genMockFunction()
}

const screen = {
  getPrimaryDisplay: () => {
    const workAreaSize = {
      height: 980,
      width: 980
    }
    return { workAreaSize }
  }
}

/* globals jest */
module.exports = {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  ipcRenderer,
  screen,
  sendMock
}
