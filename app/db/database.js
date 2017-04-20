const fs = require('fs')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = `${DB_PATH}/movieDB.json`

module.exports = {
  addOrUpdateMovie: function addOrUpdateMovie (movie) {
    let movieDB = loadDatabase()
    const existing = find(movie.imbdb, movieDB)
    if (existing) {
      // Prefer new metadata but keep all locations
      existing.location = movie.location.concat(existing.location)
    } else {
      movieDB.push(movie) // new movie
    }

    persistToFile(movieDB)
    return movieDB
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

function find (imdbID, movieDB) {
  return movieDB.find((movie) => {
    return movie.imdbID === imdbID
  })
}

function persistToFile (movies) {
  const tmpFile = `${dbFile}.tmp`
  const json = JSON.stringify(movies)
  try {
    fs.mkdirSync(DB_PATH)
  } catch (err) {
    if (err && err.code !== 'EEXIST') { // OK if directory already exists
      throw err
    }
  }
  fs.writeFileSync(tmpFile, json)
  fs.renameSync(tmpFile, dbFile) // overwrites old DB with just created one
}
