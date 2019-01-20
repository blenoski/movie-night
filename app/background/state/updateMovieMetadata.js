'use strict'

import logger from '../backgroundWorkerLogger'
import { checkIfPosterHasBeenDownloadedFor, downloadPosterFor } from '../api/poster'
import { sendMovieDatabase } from './electronActions'
import hideMovieFile from './hideMovieFile';

// -----------------------------------------------------------------------
// Primary updateMovieMetadata workflow and default export of this module.
// -----------------------------------------------------------------------
export default (movie, db) => {
  return (dispatch) => {
    // Download movie poster
    return checkIfPosterHasBeenDownloadedFor(movie)
      .then(({posterDownloaded, movie}) => {
        if (!posterDownloaded) {
          return downloadPosterFor(movie).then(() => { return movie })
        } else {
          return movie
        }
      })
      .then((movie) => {
        debugger
        db.addOrUpdate(movie)

        // TODO: if there is an existing db record with imdbID matching
        // the filename, then we should also delete that record from the
        // database as it has just been updated with real movie metadata.
        // Note: during initial search, if no data can be found for a movie
        // we set the imbdID to match the file name to ensure a unique ID
        const location = movie.fileInfo[0].location;
        const movieOld = db.findByID(location);
        if (movieOld) {
          dispatch(hideMovieFile(movieOld, db));
        } else {
          sendMovieDatabase(db.getCollection())
        }
        logger.info(`Completed saving metadata for ${movie.title}`)
      })
      .catch((error) => {
        logger.error(`metadata for ${movie.title} was not saved to database:`, { type: error.name, message: error.message })
      })
  }
}
