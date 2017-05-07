import {
  updateMovieDB,
  reducer
} from './state'
import DisplayMovies, { stateKey } from './controller'

// API
// ----

// This is the connected container.
export default DisplayMovies

// Action creators and reducer for state management.
export {
  // Dispatch this action to load a new movie database.
  updateMovieDB,

  // This is the key users of this module should use in combineReducers
  // to namespace this module's state.
  stateKey,

  // This is the reducer users of this module should use in combineReducers
  reducer
}
