import { ipcRenderer } from 'electron'
import {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} from '../../shared/events'
import store, {
  updateMovieDB,
  updateCrawlState,
  updateCurrentCrawlDirectory,
  databaseLoaded
} from '../model'
import logger from '../mainWindowLogger'

// Handle SEARCHING_DIRECTORY events
ipcRenderer.on(SEARCHING_DIRECTORY, function (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  store.dispatch(updateCurrentCrawlDirectory(directory))
  logger.debug('Dispatched updateCurrentCrawlDirectory action', { directory })
})

// Handle CRAWL_COMPLETE events
ipcRenderer.on(CRAWL_COMPLETE, function (event, directory) {
  logger.info('Received CRAWL_COMPLETE event', { directory })
  store.dispatch(updateCurrentCrawlDirectory(directory))
  logger.info('Dispatched updateCurrentCrawlDirectory action', { directory })
  store.dispatch(updateCrawlState(false))
  logger.info('Dispatched updateCrawlState(false) action')
})

// Handle MOVIE_DATABASE events
ipcRenderer.on(MOVIE_DATABASE, (event, movieDB) => {
  logger.info('Recieved MOVIE_DATABASE event', { count: movieDB.length })
  store.dispatch(updateMovieDB(movieDB))
  setTimeout(() => {
    store.dispatch(databaseLoaded())
    logger.info('Dispatched databaseLoaded action')
  }, 500)
  logger.info('Dispatched updateMovieDB action', { count: movieDB.length })
})
