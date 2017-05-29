'use strict'
/* globals describe, test, expect */

import {
  getAllMovies, // public selectors
  getCrawlActive,
  getFeaturedMovie,
  getSearchCategory,
  getSearchQuery,
  getVisibleMovies,
  importMovies // electron action creator
} from '../index'

import { SELECT_IMPORT_DIRECTORY } from '../../../shared/events'

// Set up some test data
const movies = [
  { title: 'Old School', director: 'Todd Phillips', actors: ['Will Ferrell', 'Luke Wilson'] },
  { title: 'Super Troopers', director: 'Jay Chand', actors: ['Kevin Hefferman', 'Steve Lemme'] },
  { title: 'Wedding Crashers', director: 'David Dobkin', actors: ['Vince Vaugh', 'Owen Wilson'] },
  { title: 'Meet The Parents', director: 'Jay Roach', actors: ['Ben Stiller', 'Robert De Niro'] }
]

const state = {
  crawl: { active: true, directory: '/path/to/some/dir' },
  featuredMovie: { movie: 'someMovie', action: 'click', panelID: 2 },
  movies: {
    displayOrder: ['thriller', 'action', 'drama'],
    movieDB: [
      { genre: 'thriller', movies: [movies[0], movies[1]] },
      { genre: 'action', movies: [movies[0], movies[1], movies[2], movies[3]] },
      { genre: 'drama', movies: [movies[0], movies[1], movies[2]] }
    ]
  },
  search: {
    category: 'action',
    query: 'Old School'
  }
}

// For the public selectors, all of the logic is really delegated to other
// selectors.  Thus, we will just take snapshots here so we can be alerted of
// any changes and make sure that is what we expected.
describe('public selectors', () => {
  test('getAllMovies', () => {
    expect(getAllMovies(state)).toMatchSnapshot()
  })
  test('getCrawlActive', () => {
    expect(getCrawlActive(state)).toMatchSnapshot()
  })
  test('getFeaturedMovie', () => {
    expect(getFeaturedMovie(state)).toMatchSnapshot()
  })
  test('getSearchCategory', () => {
    expect(getSearchCategory(state)).toMatchSnapshot()
  })
  test('getSearchQuery', () => {
    expect(getSearchQuery(state)).toMatchSnapshot()
  })
  test('getVisibleMovies', () => {
    expect(getVisibleMovies(state)).toMatchSnapshot()
  })
})

// Electron action creators
const {
  sendMock
} = require('electron') // jest will automatically use mocked version

describe('electron action creators', () => {
  test('importMovies', () => {
    importMovies()
    expect(sendMock.mock.calls[0][0]).toEqual(SELECT_IMPORT_DIRECTORY)
  })
})