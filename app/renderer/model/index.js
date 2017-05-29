import { ipcRenderer } from 'electron'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import reduxLogger from 'redux-logger'

import { SELECT_IMPORT_DIRECTORY } from '../../shared/events'
import { isDevEnv } from '../../shared/utils'
import appLogger from '../mainWindowLogger'

// Reducers
import dbLoaded from './dbLoaded'
import crawl from './crawl'
import featuredMovie from './featuredMovie'
import movies from './movies'
import search from './search'

// Top level state selectors.
import {
  crawlActiveSelector,
  movieDBSelector,
  searchCategorySelector,
  searchQuerySelector
} from './selectors'

// Memoized Selectors
import enhancedFeaturedMovieSelector from './enhancedFeaturedMovie'
import visibleMoviesSelector from './visibleMovies'

// Create the redux store.
// This is the default export.
// ---------------------------
let middlewares = []
if (isDevEnv()) {
  middlewares.push(reduxLogger)
}

const rootReducer = combineReducers({
  crawl,
  dbLoaded,
  featuredMovie,
  movies,
  search
})

const store = createStore(rootReducer, applyMiddleware(...middlewares))

export default store // !!!! DEFAULT EXPORT !!!

// Re-export all the action creators.
// ----------------------------------
export * from './actions'

// Electron action creators.
// -------------------------
export const importMovies = () => {
  ipcRenderer.send(SELECT_IMPORT_DIRECTORY)
  appLogger.info('Sent SELECT_IMPORT_DIRECTORY event')
}

// Public selectors.
// These allow connected containers to depend on state
// without requiring knowledge of the state's shape.
// ----------------------------------------------------------------------
export const getAllMovies = (state) => {
  return movieDBSelector(state)
}

export const getCrawlActive = (state) => {
  return crawlActiveSelector(state)
}

export const getFeaturedMovie = (state) => {
  return enhancedFeaturedMovieSelector(state)
}

export const getSearchCategory = (state) => {
  return searchCategorySelector(state)
}

export const getSearchQuery = (state) => {
  return searchQuerySelector(state)
}

export const getVisibleMovies = (state) => {
  return visibleMoviesSelector(state)
}
