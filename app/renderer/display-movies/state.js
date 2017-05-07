// module state
const initialState = {
  movies: []
}

// action types
const UPDATE_MOVIE_DATABASE = 'update-movie-database'

// action creators
export function updateMovieDB (movieDB) {
  return {
    type: UPDATE_MOVIE_DATABASE,
    payload: movieDB
  }
}

// reducer
export function reducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_MOVIE_DATABASE:
      return { ...state, movies: action.payload }
    default:
      return state
  }
}
