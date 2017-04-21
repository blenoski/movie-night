const fs = require('fs')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = `${DB_PATH}/movieDB.json`

module.exports = {
  addOrUpdateMovie: function addOrUpdateMovie (movie) {
    let changed = false

    let movieDB = loadDatabase()
    const document = find(movie.imdbID, movieDB)
    if (document) {
      changed = update(document, movie)
    } else {
      movieDB.push(movie) // add movie to database
      changed = true
    }

    if (changed) {
      persistToFile(movieDB)
      return movieDB
    } else {
      return [] // database was not changed
    }
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

// TODO: sort DB by imbdID, then make find a binary search?
function find (imdbID, movieDB) {
  return movieDB.find((movie) => {
    return movie.imdbID === imdbID
  })
}

function update (document, movie) {
  // TODO: delegate this to a proper meta class, e.g., conflate method
  const dupLoc = document.fileInfo.find((info) => {
    return info.location === movie.fileInfo[0].location
  })
  if (!dupLoc) {
    document.fileInfo.push(movie.fileInfo[0])
    return true
  } else {
    return false // document not changed
  }
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
