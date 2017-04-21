const path = require('path')
const { readdir, lstat } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')

// The list of recognized movie file extensions.
const movieFileExtensions = ['.avi', '.mp4', '.m4v']

module.exports = {
  // Recursively searches the root directory for all movie files.
  // params.rootDirectory - the root directory to start crawl from
  // params.searchDirCb - search directory callback. Called with current directory when a new search directory is first entered.
  // params.movieFileCb - movie file callback. Called with full path to movie file whenever a movie file is found.
  crawlForMovies: function crawlForMovies (params) {
    return crawl(params.rootDirectory, params.searchDirCb, params.movieFileCb)
  }
}

// The crawl is asynchronous to prevent blocking the process and also to
// allow for parallelization. The use of promises here is needed in order to
// signal when the crawl has actually completed.
function crawl (directory, searchDirCb, movieFileCb) {
  searchDirCb(directory)
  return readdir(directory).then((items) => {
    return items.reduce((seq, item) => {
      const absPath = path.join(directory, item)
      return seq.then(() => {
        return processPath(absPath, searchDirCb, movieFileCb)
      })
    }, Promise.resolve())
  }, (err) => logger.warn(err)) // ignore directory and continue crawl
}

function processPath (absPath, searchDirCb, movieFileCb) {
  return lstat(absPath).then((stats) => {
    if (stats.isFile()) {
      const ext = path.extname(absPath)
      if (movieFileExtensions.indexOf(ext) > -1) {
        movieFileCb(absPath) // FOUND MOVIE FILE
        // Do not block crawl on movie callback.
        // This allows network requests to proceed in parallel
        // at the expense that we may send CRAWL_COMPLETE before
        // all of the network requests have been processed.
        return Promise.resolve()
      }
    } else if (stats.isDirectory()) {
      return crawl(absPath, searchDirCb, movieFileCb) // RECURSIVE!
    } else {
      return Promise.resolve() // ignore file
    }
  }, (err) => logger.warn(err)) // ignore error and continue crawl
}
