'use strict'
import { createStore, applyMiddleware } from 'redux'
import reduxLogger from 'redux-logger'
import reduxThunk from 'redux-thunk'

import { isDevEnv } from '../../shared/utils'

import {
  ADD_MOVIE_FILE,
  CRAWL_COMPLETE,
  CRAWL_START,
  MOVIE_FILE_COMPLETE,
  MOVIE_FILE_ERROR
} from './actionTypes'

import addMovieFile from './addMovieFile'
import { sendCrawlComplete } from './electronActions'

// Re-export the electron actions
// ------------------------------
export * from './electronActions'

// Reducer
// -------
const initialState = {
  completeCnt: 0,
  crawling: false,
  error: [],
  inProgress: []
}

const progress = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MOVIE_FILE: {
      return {
        ...state,
        inProgress: [...state.inProgress, action.payload]
      }
    }

    case CRAWL_COMPLETE: {
      return {
        ...state,
        crawling: false
      }
    }

    case CRAWL_START: {
      return {
        ...state,
        crawling: true
      }
    }

    case MOVIE_FILE_COMPLETE: {
      return {
        ...state,
        inProgress: state.inProgress.filter(movieFile => movieFile !== action.payload),
        completeCnt: state.completeCnt + 1
      }
    }

    case MOVIE_FILE_ERROR: {
      return {
        ...state,
        inProgress: state.inProgress.filter(
          movieFile => movieFile !== action.payload.movieFile
        ),
        error: [...state.error, action.payload]
      }
    }

    default:
      return state
  }
}

// Export function for creating redux store.
// -----------------------------------------
export const createReduxStore = (useReduxLogger) => {
  // Create the redux store.
  // This is the default export.
  // ---------------------------
  let middlewares = [reduxThunk]
  if (useReduxLogger) {
    middlewares.push(reduxLogger)
  }

  const store = createStore(progress, applyMiddleware(...middlewares))
  return store
}

// This is the actual store used in the background worker.
// -------------------------------------------------------
const store = createReduxStore(isDevEnv())
export default store

// action creators
// ----------------
function crawlStartInternal () {
  return {
    type: CRAWL_START
  }
}

function crawlCompleteInternal () {
  return {
    type: CRAWL_COMPLETE
  }
}

// Thunked action creators.
// ------------------------
export function crawlCompleteEnhanced (directory) {
  return (dispatch, getState) => {
    dispatch(crawlCompleteInternal())
    if (getState().inProgress.length === 0) {
      sendCrawlComplete(directory)
    }
  }
}

// bound action creators
// ----------------------
export const addMovie = (movieFile, db) => store.dispatch(addMovieFile(movieFile, db))
export const crawlStart = () => store.dispatch(crawlStartInternal())
export const crawlComplete = (directory) => store.dispatch(crawlCompleteEnhanced(directory))
