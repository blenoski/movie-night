'use strict'
/* globals describe, test, expect, jest */
const path = require('path')

// Get access to mock electron send events.
const { sendMock } = require('../../../__mocks__/electron')

// Mock a movie database
const mockImgFile = __filename
let mockDB = [{
  imdbID: 'tt123',
  title: 'Old School',
  imgFile: mockImgFile,
  fileInfo: [{ location: 'loc1' }]
}, {
  imdbID: 'tt456',
  title: 'Super Troopers',
  imgUrl: 'http://supertroopers.png',
  fileInfo: [{ location: 'loc2' }]
}]
jest.mock('../database', () => {
  return class DB {
    constructor () { this.flag = false }
    config () { return {} }
    getCollection () { return mockDB }
    findByID () { return undefined }
    findOne () {
      if (!this.flag) {
        this.flag = true
        return mockDB[0]
      }
      return undefined
    }
    addOrUpdate () { return mockDB }
  }
})

// Mock fetchMovieMetadata
jest.mock('../fetchMovieMetadata', () => {
  return {
    fetchMovieMetadata: jest.fn(movieFile => {
      return Promise.resolve(mockDB[0])
    })
  }
})

// Mock the poster API
jest.mock('../poster', () => {
  return {
    checkIfPosterHasBeenDownloadedFor: jest.fn(movie => {
      const posterDownloaded = movie.imgFile
      return Promise.resolve({ posterDownloaded, movie })
    }),
    downloadPosterFor: jest.fn(() => Promise.resolve())
  }
})

// These are events the backgroundWorker sends.
const {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} = require('../../shared/events')

// This is the module we are testing
const {
  handleCrawlDirectoryEvent,
  handleLoadMovieDatabaseEvent,
  movieWithAnyLocationMatching,
  conflate
} = require('../index')

describe('handleLoadMovieDatabaseEvent', () => {
  test('sends movie database when invoked', () => {
    handleLoadMovieDatabaseEvent()
    expect(sendMock).lastCalledWith(MOVIE_DATABASE, mockDB)
  })
})

describe('handleCrawlDirectoryEvent', () => {
  test('completes crawl', (done) => {
    handleCrawlDirectoryEvent(null, __dirname).then(() => {
      done()
    })
  })

  test('last send is crawl complete', () => {
    expect(sendMock).lastCalledWith(CRAWL_COMPLETE, __dirname)
  })

  test('calls search directory callback during crawl', () => {
    const searchDirs = sendMock.mock.calls.filter(call => {
      return call[0] === SEARCHING_DIRECTORY
    }).map(call => {
      const { name } = path.parse(call[1])
      return name
    })
    expect(searchDirs).toMatchSnapshot()
  })

  test('calls movie database callback during crawl', () => {
    const movieDbCalls = sendMock.mock.calls.filter(call => {
      return call[0] === MOVIE_DATABASE
    }).map(call => {
      return call[1].map(movie => movie.title)
    })
    expect(movieDbCalls).toMatchSnapshot()
  })
})

describe('movieWithAnyLocationMatching', () => {
  test('filter finds matching location', () => {
    const filter = movieWithAnyLocationMatching('loc2')
    const matches = mockDB.filter(document => {
      return filter(document)
    })
    expect(matches.length).toBe(1)
    expect(matches[0]).toEqual(mockDB[1])
  })
})

describe('conflate', () => {
  test('appends to fileInfo on unique location', () => {
    const { documentChanged, finalDocument } = conflate(mockDB[0], mockDB[1])
    expect(documentChanged).toBe(true)
    expect(finalDocument.fileInfo.length).toBe(2)
  })

  test('leaves document unchanged on duplicate location', () => {
    const { documentChanged, finalDocument } = conflate(mockDB[0], mockDB[0])
    expect(documentChanged).toBe(false)
    expect(finalDocument).toEqual(mockDB[0])
  })
})
