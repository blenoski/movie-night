'use strict'
import path from 'path'
import _ from 'underscore'

import logger from '../backgroundWorkerLogger'
import { conflate, movieWithAnyLocationMatching } from '../databaseUtils'

import { ADD_MOVIE_FILE, MOVIE_FILE_COMPLETE, MOVIE_FILE_ERROR } from './actionTypes'
import { sendCrawlComplete, sendMovieDatabase } from './electronActions'
import { fetchMovieMetadata } from '../api/fetchMovieMetadata'
import { checkIfPosterHasBeenDownloadedFor, downloadPosterFor } from '../api/poster'

// Batch sending of movie database updates so we do not overwhelm the UI process.
const debounceDuration = 250
const throttledSendMovieDatabase = _.debounce(
  (db) => sendMovieDatabase(db.getCollection()),
  debounceDuration
)

// Files with the following names will be skipped. E.g. sample.avi
const blacklist = ['sample', 'test footage']

// Action creators used internally by this module.
// Zero or 2 of these actions will be dispatched whenever the primary addMovie
// workflow is initiated.
function addMovie (movieFile) {
  return {
    type: ADD_MOVIE_FILE,
    payload: movieFile
  }
}

function movieFileComplete (movieFile) {
  return (dispatch, getState) => {
    dispatch({
      type: MOVIE_FILE_COMPLETE,
      payload: movieFile
    })

    checkFinishedCrawling(getState())
  }
}

function movieFileError (movieFile, error) {
  return (dispatch, getState) => {
    dispatch({
      type: MOVIE_FILE_ERROR,
      payload: { movieFile, error }
    })

    checkFinishedCrawling(getState())
  }
}

function checkFinishedCrawling ({crawling, inProgress}) {
  if (!crawling && inProgress.length === 0) {
    sendCrawlComplete()
  }
}

// ------------------------------------------------------------
// Primary addMovie workflow and default export of this module.
// ------------------------------------------------------------
export default (movieFile, db) => {
  return (dispatch) => {
    // Ignore any titles on blacklist.
    const { name } = path.parse(movieFile)
    if (blacklist.includes(name.toLowerCase())) {
      logger.info(`Skipping blacklisted title: ${movieFile}`)
      return
    }

    // Check if movieFile is already in the database.
    const existingDoc = db.findOne(movieWithAnyLocationMatching(movieFile))
    if (existingDoc) {
      logger.info(`Database has existing record for ${movieFile}`, {
        title: existingDoc.title,
        imdbID: existingDoc.imdbID
      })
      return
    }

    // Add the movie to progress state.
    logger.info('Found', { movieFile })
    dispatch(addMovie(movieFile))

    // Fetch the movie metadata and poster image
    let document = null
    return fetchMovieMetadata(movieFile)
      .then((movie) => {
        return checkIfPosterHasBeenDownloadedFor(movie)
      })
      .then(({posterDownloaded, movie}) => {
        document = db.findByID(movie.imdbID)
        if (shouldDownloadPoster(posterDownloaded, movie, document)) {
          return downloadPosterFor(movie).then(() => { return movie })
        } else {
          return movie
        }
      })
      .then((movie) => {
        let {documentChanged, finalDocument} = conflate(document, movie)
        if (documentChanged) {
          db.addOrUpdate(finalDocument)
          throttledSendMovieDatabase(db) // SUCCESS!!!
        }
        dispatch(movieFileComplete(movieFile))
        logger.debug(`Completed processing ${movieFile}`)
      })
      .catch((error) => {
        logger.warn(`${movieFile} not added to database:`, { type: error.name, message: error.message })
        dispatch(movieFileError(movieFile, error))
      })
  }
}

// Helpers
// -------
function shouldDownloadPoster (posterDownloaded, movie, document) {
  if (posterDownloaded && document && movie.imgUrl === document.imgUrl) {
    return false // poster image is already good to go
  } else if (!movie.imgUrl) {
    return false // there is no poster to download
  }

  return true
}

// Exporting these for testing purposes.
export const internal = {
  addMovie,
  checkFinishedCrawling,
  movieFileComplete,
  movieFileError,
  shouldDownloadPoster
}