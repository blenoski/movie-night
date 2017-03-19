// This event is fired when the user clicks on the 'Import Movies' button.
// The main process listens for this event and responds by showing a directory
// selection file dialog.  When the user selects a directory, a IMPORT_DIRECTORY
// event is fired with the selected directory.
const SELECT_IMPORT_DIRECTORY = 'select-import-directory'

// This event is fired when the user has selected an import directory.
// The backgroundWorker process listens for this event and responds by kicking
// off a crawl for files ending with common movie extensions. During the crawl,
// the backgroundWorker fires SEARCHING_DIRECTORY events upon entering a new
// subdirectory.  Upon crawl completion, the backgroundWorker fires a
// MOVIE_FILES event with the list of discovered movies.
const IMPORT_DIRECTORY = 'import-directory'

// This event is fired by the backgroundWorker process when a new subdirectory
// is entered while crawling for movie files.
const SEARCHING_DIRECTORY = 'searching-directory'

// This event is fired when the directory crawl is complete. The payload is an
// array of discovered movie files.
const MOVIE_FILES = 'movie-files'

module.exports = {
  SELECT_IMPORT_DIRECTORY,
  IMPORT_DIRECTORY,
  SEARCHING_DIRECTORY,
  MOVIE_FILES
}
