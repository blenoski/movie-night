const path = require('path')
const { ipcRenderer } = require('electron')
const {
  CRAWL_COMPLETE,
  IMPORT_DIRECTORY,
  MOVIE_METADATA,
  SEARCHING_DIRECTORY
} = require('../shared/events')
const { logEnv } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger')
const { crawlForMovies } = require('./crawlForMovies')

logEnv(logger)

// Fetch movie metadata
function fetchMovieDataFor (movie, cb) {
  const baseURL = 'http://www.omdbapi.com/?plot=full&t='
  /* global XMLHttpRequest */
  var req = new XMLHttpRequest()
  req.addEventListener('load', cb)
  req.open('GET', `${baseURL}${movie}`)
  req.send()
}

// Handle IMPORT_DIRECTORY events.
const handleImportDirectoryEvent = (event, rootDirectory) => {
  logger.info('Received IMPORT_DIRECTORY event', { rootDirectory })

  const searchDirCb = (directory) => {
    ipcRenderer.send(SEARCHING_DIRECTORY, directory)
    logger.debug('Sent SEARCHING_DIRECTORY event', { directory })
  }

  const movieFileCb = (movieFile) => {
    console.log(movieFile)

    // Extract the file name from the full path
    const { name } = path.parse(movieFile)

    // Delete anything that looks like metadata encoded in the title.
    // E.g. [1998], (2009), (D), [Meta]
    let searchTitle = name.replace(/\(.*?\)/g, '') // remove all text in parens incl. parens
      .replace(/\[.*?\]/g, '') // remove all text in brackets incl. brackets
      .trim() // remove all leading and trailing whitespace

    // Look up metadata for this movie.
    fetchMovieDataFor(searchTitle, function () {
      const metadata = JSON.parse(this.responseText)
      console.log(metadata)

      let rating = '<<RATING>>'
      if (metadata.Ratings && metadata.Ratings.length > 0) {
        rating = metadata.Ratings[0].Value || rating
      }

      const movie = {
        genre: metadata.Genre || '<<GENRE>>',
        imgSrc: metadata.Poster || '...',
        plot: metadata.Plot || 'Could not find online data for this movie',
        rating: rating,
        title: metadata.Title || name,
        year: metadata.Year || '<<RELEASE YEAR>>'
      }

      ipcRenderer.send(MOVIE_METADATA, movie)
      logger.info('Sent MOVIE_METADATA event', { title: movie.title })
    })
  }

  crawlForMovies(rootDirectory, searchDirCb, movieFileCb)
  ipcRenderer.send(CRAWL_COMPLETE, rootDirectory)
  logger.info('Sent CRAWL_COMPLETE event', { rootDirectory })
}

// Link IMPORT_DIRECTORY event to its event handler.
ipcRenderer.on(IMPORT_DIRECTORY, handleImportDirectoryEvent)
