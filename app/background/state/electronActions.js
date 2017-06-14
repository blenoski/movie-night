'use strict'
import { ipcRenderer } from 'electron'

import {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} from '../../shared/events'

import logger from '../backgroundWorkerLogger'
import { paritionMovieDatabaseByGenre } from '../databaseUtils'

export const sendCrawlComplete = (rootDirectory) => {
  ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
  logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
}

// Sends the database to the main process.
export function sendMovieDatabase (movieDB) {
  const sortedDB = paritionMovieDatabaseByGenre(movieDB)
  ipcRenderer.send(MOVIE_DATABASE, sortedDB)
  logger.info('Sent MOVIE_DATABASE event', {
    count: sortedDB.reduce((sum, genre) => sum + genre.movies.length, 0)
  })
}

// Sends the search directory to the main process.
export const sendSearchDirectory = (directory) => {
  ipcRenderer.send(SEARCHING_DIRECTORY, directory)
  logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
}
