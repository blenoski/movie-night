'use strict'
/* globals describe, test, expect, beforeAll */

const {
  createAppWindow,
  handleCrawlCompleteEvent,
  handleMovieDatabaseEvent,
  handleSearchingDirectoryEvents
} = require('../appWindow')

const {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} = require('../../shared/events')

const {
  sendMock
} = require('electron') // jest will automatically use mocked version

// Helper functions for accessing send mock.
const sendCount = () => sendMock.mock.calls.length
const sendLast = () => sendMock.mock.calls[sendCount() - 1]

// A test movie database
const movieDB = [
  { genre: 'action', movies: ['movie1', 'movie2', 'movie3'] },
  { genre: 'comedy', movies: ['movie1', 'movie2', 'movie3'] }
]

describe('appWindow', () => {
  describe('does not crash', () => {
    test(' when events sent before appWindow created', () => {
      handleCrawlCompleteEvent(null, 'crawlDirectory')
      handleMovieDatabaseEvent(null, movieDB)
      handleSearchingDirectoryEvents(null, 'searchDir')
      expect(sendCount()).toBe(0)
    })
  })

  describe('event handling', () => {
    beforeAll(() => {
      createAppWindow() // Create the mocked app window
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
      [MOVIE_DATABASE]: movieDB,
      [SEARCHING_DIRECTORY]: 'searchDir'
    }

    Object.keys(eventHandlers).forEach(event => {
      describe(event, () => {
        test('calls send with received input', () => {
          eventHandlers[event](null, testData[event])
          expect(sendLast()).toEqual([event, testData[event]])
        })

        test('handles empty input', () => {
          const data = event === MOVIE_DATABASE ? [] : ''
          eventHandlers[event](null, data)
          expect(sendLast()).toEqual([event, data])
        })
      })
    })
  })
})
