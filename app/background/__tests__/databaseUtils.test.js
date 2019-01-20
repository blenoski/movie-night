'use strict'
/* globals describe, test, expect */

import { conflate } from '../databaseUtils'

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
