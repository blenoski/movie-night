// module state
const initialState = {
  isCrawling: false,
  searchDir: '',
  movies: []
}

// action types
const IS_CRAWLING = 'is-crawling'
const SEARCH_DIRECTORY = 'search-directory'
const MOVIE_FILES = 'movie-files'

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

export function updateMovies (movies) {
  return {
    type: MOVIE_FILES,
    payload: movies
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case IS_CRAWLING:
      return { ...state, isCrawling: action.payload }
    case SEARCH_DIRECTORY:
      return { ...state, searchDir: action.payload, isCrawling: true }
    case MOVIE_FILES:
      return { ...state, movies: action.payload, isCrawling: false }
    default:
      return state
  }
}
