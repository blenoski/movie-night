'use strict'

import logger from '../backgroundWorkerLogger'
import { sendMovieDatabase } from './electronActions'

// -----------------------------------------------------------------------
// Primary hideMovieFile workflow and default export of this module.
// -----------------------------------------------------------------------
export default (movie, db) => {
  return (dispatch) => {
    return Promise.resolve(movie)
      .then((movie) => {
        const hidden = {...movie, hidden: true}
        db.addOrUpdate(hidden)
        sendMovieDatabase(db.getCollection())
        logger.info(`Completed hide ${movie.title}`)
      })
      .catch((error) => {
        logger.error(`${movie.title} was not hidden:`, { type: error.name, message: error.message })
      })
  }
}
