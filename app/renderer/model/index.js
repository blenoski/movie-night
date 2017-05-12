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
  isCrawling: false,
  crawlDirectory: '',
  searchQuery: '',
  movies: [],
  filteredMovies: []
}

// Actions
// -------
const IS_CRAWLING = 'is-crawling'
const CRAWL_DIRECTORY = 'crawl-directory'
const UPDATE_MOVIE_DATABASE = 'update-movie-database'
const UPDATE_SEARCH_QUERY = 'update-search-query'

// Action creators.
// These are also public interface.
// --------------------------------
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
    case UPDATE_MOVIE_DATABASE:
      const movies = action.payload
      return { ...state, movies, filteredMovies: filterMovies(state.searchQuery, movies) }
    case UPDATE_SEARCH_QUERY:
      const searchQuery = action.payload
      return { ...state, searchQuery, filteredMovies: filterMovies(searchQuery, state.movies) }
    default:
      return state
  }
}

// Create the redux store
// -----------------------
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(reducer)

export default store
