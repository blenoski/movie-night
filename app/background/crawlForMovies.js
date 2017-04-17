const fs = require('fs')
const path = require('path')
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

function crawl (directory, searchDirCb, movieFileCb) {
  searchDirCb(directory)
  return readdir(directory).then((items) => {
    return items.reduce((seq, item) => {
      const absPath = path.join(directory, item)
      return seq.then(() => {
        return processPath(absPath, searchDirCb, movieFileCb)
      })
    }, Promise.resolve())
  }, (err) => logger.warn(err))
}

function processPath (absPath, searchDirCb, movieFileCb) {
  return lstat(absPath).then((stats) => {
    if (stats.isFile()) {
      const ext = path.extname(absPath)
      if (movieFileExtensions.indexOf(ext) > -1) {
        return movieFileCb(absPath)
      }
    } else if (stats.isDirectory()) {
      return crawl(absPath, searchDirCb, movieFileCb)
    } else {
      return Promise.resolve()
    }
  }, (err) => logger.warn(err))
}

function readdir (directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, items) => {
      if (err) {
        reject(err)
      }
      resolve(items)
    })
  })
}

function lstat (absPath) {
  return new Promise((resolve, reject) => {
    fs.lstat(absPath, (err, stats) => {
      if (err) {
        reject(err)
      }
      resolve(stats)
    })
  })
}
