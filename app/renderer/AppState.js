import { createStore, applyMiddleware, combineReducers } from 'redux'
import {
  reducer as importMoviesReducer,
  stateKey as importMovieStateKey
} from './import-movies'

// Set-up the combined redux reducers.
let reducers = {}
reducers[importMovieStateKey] = importMoviesReducer
const allReducers = combineReducers(reducers)

// Create the redux store
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(allReducers)

export default store
