const fs = require('fs')
const path = require('path')

// The list of recognized movie file extensions.
const movieFileExtensions = ['.avi', '.mp4', '.m4v']

// Partitions a directory into files and subdirs.
const partition = (directory) => {
  const items = fs.readdirSync(directory)

  let files = []
  let subdirs = []
  items.forEach((item) => {
    const absPath = path.join(directory, item)
    const stats = fs.lstatSync(absPath)
    if (stats.isFile()) {
      files.push(absPath)
    } else if (stats.isDirectory()) {
      subdirs.push(absPath)
    }
  })

  return { files, subdirs }
}

const crawl = (directory, searchDirCb, movieFileCb) => {
  searchDirCb(directory)
  let { files, subdirs } = partition(directory)

  // First search for movies in this directory.
  files.forEach((file) => {
    const ext = path.extname(file)
    if (movieFileExtensions.indexOf(ext) > -1) {
      movieFileCb(file)
    }
  })

  // Then recursively search subdirs
  subdirs.forEach((subdir) => {
    crawl(subdir, searchDirCb, movieFileCb)
  })
}

const crawlForMovies = (rootDirectory, searchDirCb, movieFileCb) => {
  crawl(rootDirectory, searchDirCb, movieFileCb)
}

module.exports = {
  // Recursively searches the root directory for all movie files.
  // @param1 - the root directory to start crawl from
  // @param2 - search directory callback. Called with current directory when a new search directory is first entered.
  // @param3 - movie file callback. Called with full path to movie file whenever a movie file is found.
  crawlForMovies
}
