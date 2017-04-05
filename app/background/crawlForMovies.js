const fs = require('fs')
const path = require('path')
const logger = require('./backgroundWorkerLogger')

// The list of recognized movie file extensions.
const movieFileExtensions = ['.avi', '.mp4', '.m4v']

module.exports = {
  // Recursively searches the root directory for all movie files.
  // @param1 - the root directory to start crawl from
  // @param2 - search directory callback. Called with current directory when a new search directory is first entered.
  // @param3 - movie file callback. Called with full path to movie file whenever a movie file is found.
  crawlForMovies: function crawlForMovies (rootDirectory, searchDirCb, movieFileCb) {
    crawl(rootDirectory, searchDirCb, movieFileCb)
  }
}

function crawl (directory, searchDirCb, movieFileCb) {
  searchDirCb(directory)

  fs.readdir(directory, (err, items) => {
    if (err) {
      logger.error(err)
      return
    }

    items.forEach((item) => {
      const absPath = path.join(directory, item)
      processPath(absPath, searchDirCb, movieFileCb)
    })
  })
}

function processPath (absPath, searchDirCb, movieFileCb) {
  fs.lstat(absPath, (err, stats) => {
    if (err) {
      logger.error(err)
      return
    }

    if (stats.isFile()) {
      const ext = path.extname(absPath)
      if (movieFileExtensions.indexOf(ext) > -1) {
        movieFileCb(absPath)
      }
    } else if (stats.isDirectory()) {
      crawl(absPath, searchDirCb, movieFileCb)
    }
  })
}
