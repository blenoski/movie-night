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
  crawlDirectory: '',
  dbLoaded: false,
  featuredMovie: { movie: null, action: '', panelID: -1 },
  filteredMovies: [],
  genreDisplayOrder: [],
  isCrawling: false,
  movies: [],
  searchCategory: '',
  searchQuery: ''
}

// Actions
// -------
const CLEAR_FEATURED_MOVIE = 'clear-featured-movie'
const CLEAR_SEARCH_RESULTS = 'clear-search-results'
const CLEAR_SEARCH_QUERY = 'clear-search-query'
const CRAWL_DIRECTORY = 'crawl-directory'
const DATABASE_LOADED = 'database-loaded'
const IS_CRAWLING = 'is-crawling'
const UPDATE_FEATURED_MOVIE = 'update-featured-movie'
const UPDATE_MOVIE_DATABASE = 'update-movie-database'
const UPDATE_SEARCH_CATEGORY = 'update-search-category'
const UPDATE_SEARCH_QUERY = 'update-search-query'

// Action creators.
// These are also public interface.
// --------------------------------
export function clearFeaturedMovie () {
  return {
    type: CLEAR_FEATURED_MOVIE
  }
}

export function clearSearchResults () {
  return {
    type: CLEAR_SEARCH_RESULTS
  }
}

export function clearSearchQuery () {
  return {
    type: CLEAR_SEARCH_QUERY
  }
}

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

export function updateFeaturedMovie ({ movie, action, panelID }) {
  return {
    type: UPDATE_FEATURED_MOVIE,
    payload: { movie, action, panelID }
  }
}

export function updateMovieDB (movieDB) {
  return {
    type: UPDATE_MOVIE_DATABASE,
    payload: movieDB
  }
}

export function updateSearchCategory (text) {
  return {
    type: UPDATE_SEARCH_CATEGORY,
    payload: text
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
    case IS_CRAWLING: {
      return { ...state, isCrawling: action.payload }
    }

    case CRAWL_DIRECTORY: {
      return { ...state, isCrawling: true, crawlDirectory: action.payload }
    }

    case CLEAR_SEARCH_RESULTS: {
      const nextMovies = state.movies
      const nextDisplayOrder = computeNextState(nextMovies, state.isCrawling, state.genreDisplayOrder)
      return {
        ...state,
        featuredMovie: { movie: null, action: '', panelID: -1 },
        filteredMovies: sortIntoDisplayOrder(nextMovies, nextDisplayOrder),
        genreDisplayOrder: nextDisplayOrder,
        searchCategory: '',
        searchQuery: ''
      }
    }

    case CLEAR_FEATURED_MOVIE: {
      return {
        ...state,
        featuredMovie: { movie: null, action: '', panelID: -1 }
      }
    }

    case CLEAR_SEARCH_QUERY: {
      const searchQuery = ''
      const nextMovies = filterMovies(state.searchCategory, searchQuery, state.movies)
      const nextDisplayOrder = computeNextState(nextMovies, state.isCrawling, state.genreDisplayOrder)
      return {
        ...state,
        featuredMovie: { movie: null, action: '', panelID: -1 },
        filteredMovies: sortIntoDisplayOrder(nextMovies, nextDisplayOrder),
        genreDisplayOrder: nextDisplayOrder,
        searchQuery: ''
      }
    }

    case DATABASE_LOADED: {
      return { ...state, dbLoaded: true }
    }

    case UPDATE_FEATURED_MOVIE: {
      return {
        ...state,
        featuredMovie: action.payload
      }
    }

    case UPDATE_MOVIE_DATABASE: {
      const movies = action.payload
      const nextMovies = filterMovies(state.searchCategory, state.searchQuery, movies)
      const nextDisplayOrder = computeNextState(nextMovies, state.isCrawling, state.genreDisplayOrder)
      return {
        ...state,
        filteredMovies: sortIntoDisplayOrder(nextMovies, nextDisplayOrder),
        genreDisplayOrder: nextDisplayOrder,
        movies
      }
    }

    case UPDATE_SEARCH_CATEGORY: {
      const searchCategory = action.payload
      const nextMovies = filterMovies(searchCategory, state.searchQuery, state.movies)
      const nextDisplayOrder = computeNextState(nextMovies, state.isCrawling, state.genreDisplayOrder)
      return {
        ...state,
        featuredMovie: { movie: null, action: '', panelID: -1 },
        filteredMovies: sortIntoDisplayOrder(nextMovies, nextDisplayOrder),
        genreDisplayOrder: nextDisplayOrder,
        searchCategory
      }
    }

    case UPDATE_SEARCH_QUERY: {
      const searchQuery = action.payload
      const nextMovies = filterMovies(state.searchCategory, searchQuery, state.movies)
      const nextDisplayOrder = computeNextState(nextMovies, state.isCrawling, state.genreDisplayOrder)

      // If search results are only a single movie, then feature it.
      // Otherwise, make sure we have cleared any featured movie.
      let featuredMovie = { movie: null, action: '', panelID: -1 }
      if (searchQuery && nextMovies.length === 1) {
        const allMovies = nextMovies[0].movies
        if (allMovies.length === 1) {
          const onlyMovie = nextMovies[0].movies[0]
          featuredMovie = { movie: onlyMovie, action: 'search', panelID: -1 }
        }
      }

      return {
        ...state,
        featuredMovie,
        filteredMovies: sortIntoDisplayOrder(nextMovies, nextDisplayOrder),
        genreDisplayOrder: nextDisplayOrder,
        searchQuery
      }
    }

    default:
      return state
  }
}

// Returns next state for genreDisplayOrder
function computeNextState (movies, isCrawling, currentDisplayOrder) {
  let genreDisplayOrder = currentDisplayOrder.filter(el => true) // make deep copy
  if (!isCrawling || !genreDisplayOrder) {
    genreDisplayOrder = rankGenresForDisplay(movies)
  } else {
    const newGenres = computeNewGenres(movies, genreDisplayOrder)
    genreDisplayOrder.push(...newGenres)
  }
  return genreDisplayOrder
}

// Returns list of genres sorted from most movies to least movies.
function rankGenresForDisplay (movies) {
  return movies.map(genre => ({ genre: genre.genre, count: genre.movies.length }))
    .sort((lhs, rhs) => {
      if (rhs.count !== lhs.count) { // sort by count first
        return rhs.count - lhs.count
      } else {
        return rhs.genre < lhs.genre // alphanumeric second
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
