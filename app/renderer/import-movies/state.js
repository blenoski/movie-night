// module state
const initialState = {
  isCrawling: false,
  searchDir: '',
  movies: []
}

// action types
const IS_CRAWLING = 'is-crawling'
const SEARCH_DIRECTORY = 'search-directory'
const ADD_MOVIE = 'add-movie'

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

export function addMovie (movie) {
  return {
    type: ADD_MOVIE,
    payload: movie
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case IS_CRAWLING:
      return { ...state, isCrawling: action.payload }
    case SEARCH_DIRECTORY:
      return { ...state, searchDir: action.payload, isCrawling: true }
    case ADD_MOVIE:
      return { ...state, movies: state.movies.concat(action.payload) }
    default:
      return state
  }
}
