// module state
const initialState = {
  isCrawling: false,
  searchDir: '',
  movies: []
}

// action types
const IS_CRAWLING = 'is-crawling'
const SEARCH_DIRECTORY = 'search-directory'
const UPDATE_MOVIE_DATABASE = 'update-movie-database'

// action creators
export function updateCrawling (isCrawling) {
  return {
    type: IS_CRAWLING,
    payload: isCrawling
  }
}

export function updateSearchDirectory (directory) {
  return {
    type: SEARCH_DIRECTORY,
    payload: directory
  }
}

export function updateMovieDB (movieDB) {
  return {
    type: UPDATE_MOVIE_DATABASE,
    payload: movieDB
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case IS_CRAWLING:
      return { ...state, isCrawling: action.payload }
    case SEARCH_DIRECTORY:
      return { ...state, searchDir: action.payload, isCrawling: true }
    case UPDATE_MOVIE_DATABASE:
      return { ...state, movies: action.payload }
    default:
      return state
  }
}
