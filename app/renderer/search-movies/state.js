// module state
const initialState = {
  searchQuery: '',
  searchCategory: ''
}

// action types
const UPDATE_SEARCH_QUERY = 'update-search-query'
const UPDATE_SEARCH_CATEGORY = 'update-search-category'

// action creators
export function updateSearchQuery (text) {
  return {
    type: UPDATE_SEARCH_QUERY,
    payload: text
  }
}

export function updateSearchCategory (category) {
  const normalizedCategory = (category === 'All') ? '' : category
  return {
    type: UPDATE_SEARCH_CATEGORY,
    payload: normalizedCategory
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }
    case UPDATE_SEARCH_CATEGORY:
      return { ...state, searchCategory: action.payload }
    default:
      return state
  }
}
