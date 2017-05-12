import { createStore, applyMiddleware, combineReducers } from 'redux'
import {
  reducer as importMoviesReducer,
  stateKey as importMovieStateKey
} from './import-movies'
import {
  reducer as searchMoviesReducer,
  stateKey as searchMovieStateKey
} from './search-movies'

// Application Level state
// ------------------------

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
function movies (state = [], action) {
  switch (action.type) {
    case UPDATE_MOVIE_DATABASE:
      return action.payload
    default:
      return state
  }
}

// Set-up the combined redux reducers.
// -----------------------------------
const allReducers = combineReducers({
  movies,
  [importMovieStateKey]: importMoviesReducer,
  [searchMovieStateKey]: searchMoviesReducer
})

// Create the redux store
// -----------------------
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(allReducers)

export default store
