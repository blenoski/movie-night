const {
  createWindows,
  handleCrawlCompleteEvent,
  handleImportDirectoryEvent,
  handleMovieDatabaseEvent,
  handleSearchingDirectoryEvents
} = require('../main')

const {
  createBackgroundWindow,
  handleCrawlDirectorySelectionEvent,
  loadMovieDatabase
} = require('../backgroundWorker')

const {
  CRAWL_COMPLETE,
  CRAWL_DIRECTORY,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY
} = require('../../shared/events')

const {
  sendMock
} = require('electron') // jest will automatically use mocked version

/* globals describe, test, expect, beforeAll */

// Helper functions for accessing send mock.
const sendCount = () => sendMock.mock.calls.length
const sendLast = () => sendMock.mock.calls[sendCount() - 1]

describe('main process', () => {
  describe('does not crash', () => {
    test(' when events sent before app windows created', () => {
      handleCrawlCompleteEvent(null, 'crawlDirectory')
      handleCrawlDirectorySelectionEvent([])
      handleImportDirectoryEvent({sender: 'test'})
      handleMovieDatabaseEvent(null, ['movie1', 'movie2', 'movie3'])
      handleSearchingDirectoryEvents(null, 'searchDir')
      loadMovieDatabase()
      expect(sendCount()).toBe(0)
    })
  })

  describe('event handling', () => {
    beforeAll(() => {
      createWindows() // Create the mocked app window
      createBackgroundWindow() // Create the mocked backgroundWorker
    })

    describe(SELECT_IMPORT_DIRECTORY, () => {
      test('does not crash after app windows created', () => {
        handleImportDirectoryEvent({sender: 'test'})
      })
    })

    describe(CRAWL_DIRECTORY, () => {
      test('calls send with selection', () => {
        handleCrawlDirectorySelectionEvent(['crawlDir'])
        expect(sendLast()).toEqual([CRAWL_DIRECTORY, 'crawlDir'])
      })

      test('does not call send on empty selection', () => {
        const count = sendCount()
        handleCrawlDirectorySelectionEvent()
        expect(count).toEqual(sendCount())
        handleCrawlDirectorySelectionEvent([])
        expect(count).toEqual(sendCount())
      })
    })

    describe(LOAD_MOVIE_DATABASE, () => {
      test('calls send', () => {
        loadMovieDatabase()
        expect(sendLast()).toEqual([LOAD_MOVIE_DATABASE])
      })
    })

    // Remaining event handlers can be tested with a loop
    // to reduce duplicated code.
    const eventHandlers = {
      [CRAWL_COMPLETE]: handleCrawlCompleteEvent,
      [MOVIE_DATABASE]: handleMovieDatabaseEvent,
      [SEARCHING_DIRECTORY]: handleSearchingDirectoryEvents
    }

    const testData = {
      [CRAWL_COMPLETE]: 'crawlDir',
      [MOVIE_DATABASE]: ['movie1', 'movie2', 'movie3'],
      [SEARCHING_DIRECTORY]: 'searchDir'
    }

    Object.keys(eventHandlers).forEach(event => {
      describe(event, () => {
        test('calls send with received input', () => {
          eventHandlers[event](null, testData[event])
          expect(sendLast()).toEqual([event, testData[event]])
        })

        test('handles empty input', () => {
          eventHandlers[event](null, '')
          expect(sendLast()).toEqual([event, ''])
        })
      })
    })
  })
})
