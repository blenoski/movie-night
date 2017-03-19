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

const crawl = (directory, allMovies, searchDirCb) => {
  searchDirCb(directory)
  let { files, subdirs } = partition(directory)

  // First search for movies in this directory.
  const movies = files.filter((file) => {
    const ext = path.extname(file)
    return movieFileExtensions.indexOf(ext) > -1
  })
  allMovies.push(...movies)

  // Then recursively search subdirs
  subdirs.forEach((subdir) => {
    crawl(subdir, allMovies, searchDirCb)
  })
}

// IMPORT_DIRECTORY event handler.
// Recursively searches the root directory for all movie files.
const crawlForMovies = (rootDirectory, searchDirCb) => {
  let movies = []
  crawl(rootDirectory, movies, searchDirCb)
  return movies
}

module.exports = {
  crawlForMovies
}
