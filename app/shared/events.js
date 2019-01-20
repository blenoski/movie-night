// This event is fired when the user clicks on the 'Import Movies' button.
// The main process listens for this event and responds by showing a directory
// selection file dialog.  When the user selects a directory, a CRAWL_DIRECTORY
// event is fired with the selected directory.
const SELECT_IMPORT_DIRECTORY = 'select-import-directory'

// This event is fired when the user has selected an import directory.
// The backgroundWorker process listens for this event and responds by kicking
// off a crawl for files ending with common movie extensions.
const CRAWL_DIRECTORY = 'crawl-directory'

// This event is fired by the backgroundWorker process when a new subdirectory
// is entered while crawling for movie files.
const SEARCHING_DIRECTORY = 'searching-directory'

// This event is fired when the crawl for movies is complete.
const CRAWL_COMPLETE = 'crawl-complete'

// This event is fired whenver the movie database is updated.
const MOVIE_DATABASE = 'movie-database'

// Fired on application startup.
const LOAD_MOVIE_DATABASE = 'load-movie-database'

// This event is fired when the metadata for a single movie is updated.
const UPDATE_MOVIE_METADATA = 'update-movie-metadata'

// This event is fired when a single movie is moved to the trash
const MOVE_MOVIE_TO_TRASH = 'move-movie-to-trash'

// All log messages are routed through main process.
const LOG_MESSAGE = 'log-message'

module.exports = {
  CRAWL_COMPLETE,
  CRAWL_DIRECTORY,
  LOAD_MOVIE_DATABASE,
  LOG_MESSAGE,
  MOVE_MOVIE_TO_TRASH,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY,
  UPDATE_MOVIE_METADATA
}
