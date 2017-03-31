import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { ipcRenderer } from 'electron'
import { SEARCHING_DIRECTORY, MOVIE_FILES } from '../shared/events'
import { logEnv } from '../shared/utils'

import App from './App'
import {
  reducer as importMoviesReducer,
  stateKey as importMovieStateKey,
  updateSearchDirectory,
  updateCrawling
} from './import-movies'
import logger from './mainWindowLogger'
logEnv(logger)

// Import the Bootstrap styles.
// This will make the bootstrap styling default.
// Importing unminified version so we can let Webpack handle minimization.
import 'bootstrap/dist/css/bootstrap.css'

// Set-up the combined redux reducers.
let reducers = {}
reducers[importMovieStateKey] = importMoviesReducer
const allReducers = combineReducers(reducers)

// Create the redux store
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(allReducers)

// Handle SEARCHING_DIRECTORY events
ipcRenderer.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  store.dispatch(updateSearchDirectory(directory))
  store.dispatch(updateCrawling(true))
})

// Handle MOVIE_FILES events
ipcRenderer.on(MOVIE_FILES, (event, movies, directory) => {
  logger.info('Recieved MOVIE_FILES event', { n: movies.length, directory })
  console.log(movies)
  store.dispatch(updateCrawling(false))
})

// Render the App.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
