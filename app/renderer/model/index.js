import { createStore, applyMiddleware } from 'redux'
import filterMovies from './filterMovies'

// Application State.
// This should be treated like a public interface.
// At a minimum, if any property names are changed then
// the corresponding mapStateToProps controller functions
// will need to be updated as well as the action creators
// and reducer in this file.
// ------------------------------------------------------
const initialState = {
  dbLoaded: false,
  crawlDirectory: '',
  filteredMovies: [],
  isCrawling: false,
  movies: [],
  searchQuery: ''
}

// Actions
// -------
const DATABASE_LOADED = 'database-loaded'
const CRAWL_DIRECTORY = 'crawl-directory'
const IS_CRAWLING = 'is-crawling'
const UPDATE_MOVIE_DATABASE = 'update-movie-database'
const UPDATE_SEARCH_QUERY = 'update-search-query'

// Action creators.
// These are also public interface.
// --------------------------------
export function databaseLoaded () {
  return {
    type: DATABASE_LOADED
  }
}

export function updateCrawlState (isCrawling) {
  return {
    type: IS_CRAWLING,
    payload: isCrawling
  }
}

export function updateCurrentCrawlDirectory (directory) {
  return {
    type: CRAWL_DIRECTORY,
    payload: directory
  }
}

export function updateMovieDB (movieDB) {
  return {
    type: UPDATE_MOVIE_DATABASE,
    payload: movieDB
  }
}

export function updateSearchQuery (text) {
  return {
    type: UPDATE_SEARCH_QUERY,
    payload: text
  }
}

// Reducer
// -------
function reducer (state = initialState, action) {
  switch (action.type) {
    case IS_CRAWLING:
      return { ...state, isCrawling: action.payload }
    case CRAWL_DIRECTORY:
      return { ...state, isCrawling: true, crawlDirectory: action.payload }
    case DATABASE_LOADED:
      return { ...state, dbLoaded: true }
    case UPDATE_MOVIE_DATABASE:
      const movies = action.payload
      return {
        ...state,
        filteredMovies: filterMovies(state.searchQuery, movies),
        movies
      }
    case UPDATE_SEARCH_QUERY:
      const searchQuery = action.payload
      return {
        ...state,
        filteredMovies: filterMovies(searchQuery, state.movies),
        searchQuery
      }
    default:
      return state
  }
}

// Create the redux store
// -----------------------
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(reducer)

export default store
