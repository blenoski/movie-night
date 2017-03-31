// module state
const initialState = {
  isCrawling: false,
  searchDir: '',
  movies: []
}

// action types
const SEARCH_DIRECTORY = 'search-directory'
const MOVIE_FILES = 'movie-files'
const IS_CRAWLING = 'is-crawling'

// action creators
export function updateSearchDirectory (directory) {
  return {
    type: SEARCH_DIRECTORY,
    payload: directory
  }
}

export function updateCrawling (isCrawling) {
  return {
    type: IS_CRAWLING,
    payload: isCrawling
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case SEARCH_DIRECTORY:
      return { ...state, searchDir: action.payload }
    case MOVIE_FILES:
      return { ...state, movies: action.payload }
    case IS_CRAWLING:
      return { ...state, isCrawling: action.payload }
    default:
      return state
  }
}
