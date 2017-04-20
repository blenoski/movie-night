// This event is fired when the user clicks on the 'Import Movies' button.
// The main process listens for this event and responds by showing a directory
// selection file dialog.  When the user selects a directory, a IMPORT_DIRECTORY
// event is fired with the selected directory.
const SELECT_IMPORT_DIRECTORY = 'select-import-directory'

// This event is fired when the user has selected an import directory.
// The backgroundWorker process listens for this event and responds by kicking
// off a crawl for files ending with common movie extensions.
const IMPORT_DIRECTORY = 'import-directory'

// This event is fired by the backgroundWorker process when a new subdirectory
// is entered while crawling for movie files.
const SEARCHING_DIRECTORY = 'searching-directory'

// This event is fired when a new movie is discovered during the crawl.
const MOVIE_METADATA = 'movie-files'

// This event is fired when the crawl for movies is complete.
const CRAWL_COMPLETE = 'crawl-complete'

// This event is fired when movie metadata is ready to be added to the db.
const ADD_MOVIE = 'add-movie'

// This event is fired whenver the movie database is updated.
const MOVIE_DATABASE = 'movie-database'

const LOAD_MOVIE_DATABASE = 'load-movie-database'

module.exports = {
  ADD_MOVIE,
  CRAWL_COMPLETE,
  IMPORT_DIRECTORY,
  LOAD_MOVIE_DATABASE,
  MOVIE_DATABASE,
  MOVIE_METADATA,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY
}
