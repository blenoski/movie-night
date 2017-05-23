'use strict'
/* globals describe, test, expect, jest */

// Mock the OMDb API responses.
jest.mock('../../shared/request', () => {
  return {
    getJSON: jest.fn(movieFile => {
      if (movieFile.includes('reject')) {
        return Promise.reject(new Error())
      }

      let metadata = {}
      metadata.successQuery = movieFile.slice(movieFile.indexOf('file='))
      if (movieFile.includes('imgUrl')) {
        metadata.imgUrl = 'http://poster.png'
        metadata.imdbID = 'tt123'
      }
      return Promise.resolve(metadata)
    })
  }
})

// Mock the poster image path returned from config so snapshots
// do not contain any host information.
jest.mock('../../../config', () => {
  return {
    posterImagePath: '/path/to/movie/posters'
  }
})

// This is the module we are testing
const { fetchMovieMetadata } = require('../fetchMovieMetadata')

describe('fetchMovieMetadata', () => {
  test('resolves with fileInfo metadata on successful fetch', () => {
    const movieFile = 'OldSchool.avi'
    return expect(fetchMovieMetadata(movieFile))
      .resolves.toMatchSnapshot()
  })

  test('resolves with imgFile when metadata contains imgUrl', () => {
    const movieFile = 'OldSchool imgUrl'
    return expect(fetchMovieMetadata(movieFile))
      .resolves.toMatchSnapshot()
  })

  test('rejects on omdb fetch error', () => {
    const movieFile = 'reject'
    return expect(fetchMovieMetadata(movieFile))
      .rejects.toBeInstanceOf(Error)
  })
})
