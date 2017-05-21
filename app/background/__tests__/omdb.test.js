'use strict'
/* globals describe, test, expect, jest */

// This is brittle but...
// switch on a local request count to simulate query errors.
let mockRequestCount = 0

// Mock request dependencies.
// Jest will inject this moock instead of hitting OMDb server.
// These are fairly complex mocks intended to test all the
// various ways in which a query can fail.
jest.mock('../../shared/request', () => {
  return {
    getFirstSuccess: jest.fn((urls, searchValidator) => {
      const url = urls[0]
      let data = {}

      // This is what a no response search result looks like
      if (url.includes('no%20result')) { data.Error = 'no result' }

      if (url.includes('game')) {
        // Special case: we are ignoring 'game' results in this app.
        data.Search = [{ Type: 'game' }]
      } else {
        // This is what a good search result looks like.
        // Throw in a game result to make sure we skip over it.
        data.Search = [
          { Type: 'game', imdbID: 'tt000' },
          { Type: 'movie', imdbID: 'tt123' }
        ]
      }

      // Run the search validator.
      // This mock should return a Promise so catch any errors and reject.
      try {
        searchValidator(data)
      } catch (err) {
        return Promise.reject(err)
      }

      // Resolve Promise with data and url as expected.
      return Promise.resolve({ url, data })
    }),

    getJSON: jest.fn((url, dataValidator) => {
      let data = {} // minimal response
      mockRequestCount += 1
      if (mockRequestCount === 2) {
        data.imdbID = 'tt456'
        data.Poster = 'http://thefithelement.com/tt456'
        data.Genre = 'Action, Thriller'
        data.Actors = 'Bruce Willis, Milla Jovovich'
        data.Director = 'Luc Besson'
        data.imdbRating = '7.7/10'
        data.Metascore = '72'
        data.Plot = 'Best movie ever'
        data.Rated = 'R'
        data.Runtime = '127m'
        data.Title = 'The Fifth Element'
        data.Year = '1997'
      } else if (mockRequestCount === 3 || mockRequestCount === 4) {
        data.Error = 'query error'
      } else if (mockRequestCount === 5) {
        data.Genre = 'Action, Short, Comedy'
      } else if (mockRequestCount === 6) {
        data.Genre = 'Adult, Drama'
      }

      try {
        dataValidator(data)
      } catch (err) {
        return Promise.reject(err)
      }

      return Promise.resolve(data)
    })
  }
})

// This is the module we are testing
const omdb = require('../omdb')

describe('search', () => {
  test('resolves with metadata on valid search result 1', () => {
    const movieFile = 'Old School.avi'
    return expect(omdb.fetchMovieMetadata(movieFile))
      .resolves.toMatchSnapshot()
  })

  test('resolves with metadata on valid search result 2', (done) => {
    expect.assertions(2)

    const movieFile = 'The Fifth Element.avi'
    omdb.fetchMovieMetadata(movieFile).then(({ metadata, url }) => {
      expect(metadata).toMatchSnapshot()
      expect(metadata.imdbID).toEqual('tt456')
      done()
    })
  })

  test('rejects on no search result', () => {
    return expect(omdb.fetchMovieMetadata('no result'))
      .rejects.toBeInstanceOf(omdb.test.OMDBDataError)
  })

  test('rejects on genre=game search result', () => {
    return expect(omdb.fetchMovieMetadata('game'))
      .rejects.toBeInstanceOf(omdb.test.OMDBDataError)
  })

  test('rejects on query error', () => {
    return expect(omdb.fetchMovieMetadata('query error'))
      .rejects.toBeInstanceOf(omdb.test.OMDBDataError)
  })

  test('rejects on blacklisted Short genre', () => {
    return expect(omdb.fetchMovieMetadata('short'))
      .rejects.toBeInstanceOf(omdb.test.OMDBDataError)
  })

  test('rejects on blacklisted Adult genre', () => {
    return expect(omdb.fetchMovieMetadata('adult'))
      .rejects.toBeInstanceOf(omdb.test.OMDBDataError)
  })
})
