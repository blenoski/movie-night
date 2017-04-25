import {
  updateSearchTerm,
  reducer
} from './state'
import SearchMovies, { stateKey } from './controller'

// API
// ----

// This is the connected container.
export default SearchMovies

// Action creators and reducer for state management.
export {
  updateSearchTerm,

  // This is the key users of this module should use in combineReducers
  // to namespace this module's state.
  stateKey,

  // This is the reducer users of this module should use in combineReducers
  reducer
}
