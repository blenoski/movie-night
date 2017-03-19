import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { ipcRenderer } from 'electron'
import { SEARCHING_DIRECTORY, MOVIE_FILES } from '../shared/Events'
import { logEnv } from '../shared/Utils'

import App from './App'
import reducers from './reducers'
import { updateSearchDirectory } from './actions'
import logger from './mainWindowLogger'

// Import the Bootstrap styles.
// This will make the bootstrap styling default.
// Importing unminified version so we can let Webpack handle minimization.
import 'bootstrap/dist/css/bootstrap.css'

logEnv(logger)

// Create the redux store
const createStoreWithMiddleware = applyMiddleware()(createStore)
const store = createStoreWithMiddleware(reducers)

// Handle SEARCHING_DIRECTORY events
ipcRenderer.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  store.dispatch(updateSearchDirectory(directory))
})

// Handle MOVIE_FILES events
ipcRenderer.on(MOVIE_FILES, (event, movies) => {
  logger.info('Recieved MOVIE_FILES event', { n: movies.length })
})

// Render the App.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
