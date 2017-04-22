const fs = require('fs')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = `${DB_PATH}/movieDB.json`

// TODO: batch database updates

module.exports = {
  addOrUpdateMovie: function addOrUpdateMovie (movie) {
    let movieDB = loadDatabase()

    let documentIndex = findIndexInternal('imdbID', movie.imdbID, movieDB)
    if (documentIndex >= 0) {
      movieDB[documentIndex] = movie // update existing document
    } else {
      movieDB.push(movie) // add new document
    }

    persistToFile(movieDB)
    return movieDB
  },

  findByLocation: function findByLocation (location) {
    let movieDB = loadDatabase()
    return movieDB.find((movie) => {
      for (let item of movie.fileInfo) {
        if (item.location === location) {
          return true
        }
      }
      return false
    })
  },

  findByID: function findByID (imdbID) {
    let movieDB = loadDatabase()
    return findInternal('imdbID', imdbID, movieDB)
  },

  loadDatabase: loadDatabase
}

function loadDatabase () {
  if (fs.existsSync(dbFile)) {
    return JSON.parse(fs.readFileSync(dbFile))
  } else {
    return []
  }
}

function findInternal (key, value, movieDB) {
  return movieDB.find((movie) => {
    return movie[key] === value
  })
}

function findIndexInternal (key, value, movieDB) {
  return movieDB.findIndex((movie) => {
    return movie[key] === value
  })
}

function persistToFile (movies) {
  try {
    fs.mkdirSync(DB_PATH)
  } catch (err) {
    if (err && err.code !== 'EEXIST') { // OK if directory already exists
      console.log(err)
      throw err
    }
  }

  const json = JSON.stringify(movies)
  const tmpFile = `${dbFile}.tmp`
  fs.writeFileSync(tmpFile, json)
  fs.renameSync(tmpFile, dbFile) // overwrites old DB with just created one
}
