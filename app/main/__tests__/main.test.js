const {
  handleImportDirectoryEvent
} = require('../main')

const {
  SELECT_IMPORT_DIRECTORY
} = require('../../shared/events')

/* globals describe, test */

describe('main process', () => {
  describe('does not crash', () => {
    test(' when events sent before app windows created', () => {
      handleImportDirectoryEvent({sender: 'test'})
    })
  })

  describe('event handling', () => {
    describe(SELECT_IMPORT_DIRECTORY, () => {
      test('does not crash after app windows created', () => {
        handleImportDirectoryEvent({sender: 'test'})
      })
    })
  })
})
