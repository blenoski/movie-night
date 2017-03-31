import {
  updateSearchDirectory,
  updateCrawling,
  reducer
} from './state'
import ImportMovies, { stateKey } from './controller'

// API
// ----
export {
  // Dispatch this action with the name of the directory being searched.
  updateSearchDirectory,

  // Dispatch this action with boolean true/false to indicate
  // crawling has started or stopped.
  updateCrawling,

  // This is the key users of this module should use in combineReducers
  // to namespace this module's state.
  stateKey,

  // This is the reducer users of this module should use in combineReducers
  reducer
}

// This is the connected container.
export default ImportMovies
