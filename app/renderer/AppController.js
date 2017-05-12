// The AppController is very specific to this application.
// It has knowledge of events, actions, components, etc...
// The job of the AppController is to wire up all the events, actions,
// callbacks, etc...
import { ipcRenderer } from 'electron'
import {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY
 } from '../shared/events'
import store, { updateMovieDB } from './AppState'
import {
  updateCrawling,
  updateSearchDirectory
} from './import-movies'
import logger from './mainWindowLogger'

// Handle SEARCHING_DIRECTORY events
ipcRenderer.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  store.dispatch(updateSearchDirectory(directory))
  logger.debug('Dispatched updateSearchDirectory action', { directory })
})

// Handle CRAWL_COMPLETE events
ipcRenderer.on(CRAWL_COMPLETE, function (event, directory) {
  logger.info('Received CRAWL_COMPLETE event', { directory })
  store.dispatch(updateSearchDirectory(directory))
  logger.info('Dispatched updateSearchDirectory action', { directory })
  store.dispatch(updateCrawling(false))
  logger.info('Dispatched updateCrawling(false) action')
})

// Handle MOVIE_DATABASE events
ipcRenderer.on(MOVIE_DATABASE, (event, movieDB) => {
  logger.info('Recieved MOVIE_DATABASE event', { count: movieDB.length })
  store.dispatch(updateMovieDB(movieDB))
  logger.info('Dispatched updateMovieDB action', { count: movieDB.length })
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
