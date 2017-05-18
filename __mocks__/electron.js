// Electron modules must be run in an an electron process. Jest runs
// in a node process.  Thus, we will mock out the Electron modules here.
// https://facebook.github.io/jest/docs/manual-mocks.html
'use strict'

const ipcRenderer = {
  on: jest.genMockFunction()
}

/* globals jest */
module.exports = {
  ipcRenderer
}
