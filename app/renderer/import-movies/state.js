// module state
const initialState = {
  isCrawling: false,
  searchDir: ''
}

// action types
const IS_CRAWLING = 'is-crawling'
const SEARCH_DIRECTORY = 'search-directory'

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

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case IS_CRAWLING:
      return { ...state, isCrawling: action.payload }
    case SEARCH_DIRECTORY:
      return { ...state, searchDir: action.payload, isCrawling: true }
    default:
      return state
  }
}
