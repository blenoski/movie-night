'use strict'
/* globals describe, test, expect */

import { conflate, movieWithAnyLocationMatching } from '../databaseUtils'

const mockImgFile = __filename
let mockDB = [{
  imdbID: 'tt123',
  title: 'Old School',
  genres: ['comedy'],
  imgFile: mockImgFile,
  fileInfo: [{ location: 'loc1' }]
}, {
  imdbID: 'tt456',
  title: 'Super Troopers',
  genres: ['action'],
  imgUrl: 'http://supertroopers.png',
  fileInfo: [{ location: 'loc2' }]
}]

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
