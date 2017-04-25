// module state
const initialState = {
  searchTerm: ''
}

// action types
const UPDATE_SEARCH_TERM = 'search'

// action creators
export function updateSearchTerm (text) {
  return {
    type: UPDATE_SEARCH_TERM,
    payload: text
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_SEARCH_TERM:
      return { ...state, searchTerm: action.payload }
    default:
      return state
  }
}
