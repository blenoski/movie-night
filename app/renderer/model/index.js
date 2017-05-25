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
  searchQuery: '',
  genreDisplayOrder: [],
  scrolling: false
}

// Actions
// -------
const DATABASE_LOADED = 'database-loaded'
const CRAWL_DIRECTORY = 'crawl-directory'
const IS_CRAWLING = 'is-crawling'
const UPDATE_MOVIE_DATABASE = 'update-movie-database'
const UPDATE_SEARCH_QUERY = 'update-search-query'
const UPDATE_SCROLLING = 'update-scrolling'

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

export function updateScrolling (isScrolling) {
  return {
    type: UPDATE_SCROLLING,
    payload: isScrolling
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
      let filteredMovies = state.filteredMovies
      let genreDisplayOrder = state.genreDisplayOrder
      if (!state.scrolling) { // Update displayed movies only if we are NOT scrolling
        const fmud = filterMovies(state.searchQuery, movies)
        genreDisplayOrder = computeNextGenreDisplayOrderState(fmud, state, false)
        filteredMovies = sortIntoDisplayOrder(fmud, genreDisplayOrder)
      }
      return {
        ...state,
        filteredMovies,
        genreDisplayOrder,
        movies
      }
    case UPDATE_SEARCH_QUERY:
      const searchQuery = action.payload
      const fmsq = filterMovies(searchQuery, state.movies)
      const nextDisplayOrder = computeNextGenreDisplayOrderState(fmsq, state, true)
      return {
        ...state,
        filteredMovies: sortIntoDisplayOrder(fmsq, nextDisplayOrder),
        genreDisplayOrder: nextDisplayOrder,
        searchQuery
      }
    case UPDATE_SCROLLING:
      const nextScrollingState = action.payload
      let nextFilteredMovies = state.filteredMovies
      if (state.scrolling && !nextScrollingState) {
        // If state is changing from scrolling to not scrolling,
        // then go ahead and update the filtered movies.
        const fmus = filterMovies(state.searchQuery, state.movies)
        const genreDisplayOrder = computeNextGenreDisplayOrderState(fmus, state, false)
        nextFilteredMovies = sortIntoDisplayOrder(fmus, genreDisplayOrder)
      }
      return {
        ...state,
        scrolling: nextScrollingState,
        filteredMovies: nextFilteredMovies
      }
    default:
      return state
  }
}

// Returns next state for genreDisplayOrder
function computeNextGenreDisplayOrderState (movies, {isCrawling, genreDisplayOrder}, searchQueryUpdated) {
  let nextGenreDisplayOrder = genreDisplayOrder.filter(el => true) // make deep copy
  if (searchQueryUpdated || !isCrawling || !nextGenreDisplayOrder) {
    nextGenreDisplayOrder = rankGenresForDisplay(movies)
  } else {
    const newGenres = computeNewGenres(movies, nextGenreDisplayOrder)
    nextGenreDisplayOrder.push(...newGenres)
  }
  return nextGenreDisplayOrder
}

// Returns list of genres sorted from most movies to least movies.
function rankGenresForDisplay (movies) {
  return movies.map(genre => {
    return {
      genre: genre.genre,
      count: genre.movies.length,
      hasPoster: genre.movies[0].imgFile
    }
  }).sort((lhs, rhs) => {
    if (rhs.hasPoster && !lhs.hasPoster) { // sort by has poster first
      return 1
    } else if (lhs.hasPoster && !rhs.hasPoster) {
      return -1
    }

    if (rhs.count !== lhs.count) { // sort by count second
      return rhs.count - lhs.count
    } else {
      return rhs.genre < lhs.genre // alphanumeric third
    }
  }).map(genre => genre.genre)
}

function computeNewGenres (movies, genres) {
  return movies.map(genre => genre.genre).filter(genre => genres.indexOf(genre) < 0)
}

function sortIntoDisplayOrder (movies, genreDisplayOrder) {
  return genreDisplayOrder.map(genre => {
    return movies.find(el => el.genre === genre)
  })
}

// Create the redux store
// -----------------------
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(reducer)

export default store
