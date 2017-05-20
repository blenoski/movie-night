const {
  createBackgroundWindow,
  handleCrawlDirectorySelectionEvent,
  loadMovieDatabase
} = require('../backgroundWorker')

const {
  CRAWL_DIRECTORY,
  LOAD_MOVIE_DATABASE
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
      handleCrawlDirectorySelectionEvent([])
      loadMovieDatabase()
      expect(sendCount()).toBe(0)
    })
  })

  describe('event handling', () => {
    beforeAll(() => {
      createBackgroundWindow() // Create the mocked backgroundWorker
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
  })
})
