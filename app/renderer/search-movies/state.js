// module state
const initialState = {
  searchQuery: ''
}

// action types
const UPDATE_SEARCH_QUERY = 'update-search-query'

// action creators
export function updateSearchQuery (text) {
  return {
    type: UPDATE_SEARCH_QUERY,
    payload: text
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }
    default:
      return state
  }
}
