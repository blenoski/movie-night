import {
  updateSearchDirectory,
  updateCrawling,
  reducer
} from './state'
import ImportMovies, { stateKey } from './controller'

// API
// ----

// This is the connected container consisting of a clickable button
// and a read only text box. The text in the text box can be set by dispatching
// the 'updateSearchDirectory' action with the desired text.  The onClick event
// handler for the clickable button can be set by passing in an 'onClick'
// function on the props, e.g., <ImportMovies onClick={this.importMovies} />
export default ImportMovies

// Action creators and reducer for state management.
export {
  // Dispatch this action with the name of the directory being searched.
  // Note: this will disable the clickable button until 'updateCrawling' is
  // called with false.
  updateSearchDirectory,

  // Dispatch this action with boolean true/false to indicate
  // crawling has started (true) or stopped (false). During crawling, the
  // clickable button is disabled. Dispatch this action with false to re-enable
  // the clickable button when crawling has completed.
  updateCrawling,

  // This is the key users of this module should use in combineReducers
  // to namespace this module's state.
  stateKey,

  // This is the reducer users of this module should use in combineReducers
  reducer
}
