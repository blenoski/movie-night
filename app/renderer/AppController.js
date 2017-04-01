// The AppController is very specific to this application.
// It has knowledge of events, actions, components, etc...
// The job of the AppController is to wire up all the events, actions,
// callbacks, etc...
import { ipcRenderer } from 'electron'
import {
  SELECT_IMPORT_DIRECTORY,
  SEARCHING_DIRECTORY,
  MOVIE_FILES
 } from '../shared/events'
import store from './AppState'
import {
  updateSearchDirectory,
  updateCrawling
} from './import-movies'
import logger from './mainWindowLogger'

// Handle SEARCHING_DIRECTORY events
ipcRenderer.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  store.dispatch(updateSearchDirectory(directory))
  logger.debug('Dispatched updateSearchDirectory action', { directory })
})

// Handle MOVIE_FILES events
ipcRenderer.on(MOVIE_FILES, (event, movies, directory) => {
  logger.info('Recieved MOVIE_FILES event', { n: movies.length, directory })
  console.log(movies)
  store.dispatch(updateCrawling(false))
  logger.info('Dispatched updateCrawling(false) action')
})

// Invoking this function will kick off the import movies workflow.
function importMovies () {
  ipcRenderer.send(SELECT_IMPORT_DIRECTORY)
  logger.info('Sent SELECT_IMPORT_DIRECTORY event')
}

// API
const AppController = {
  importMovies
}

export default AppController
