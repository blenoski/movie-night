// https://facebook.github.io/jest/docs/manual-mocks.html
// 'use strict'
// const electron = jest.genMockFromModule('electron') /* globals jest */
// module.exports = electron

const ipcRenderer = {
  on: jest.genMockFunction()
}

/* globals jest */
module.exports = {
  require: jest.genMockFunction(),
  match: jest.genMockFunction(),
  app: jest.genMockFunction(),
  remote: jest.genMockFunction(),
  dialog: jest.genMockFunction(),
  ipcRenderer
}
