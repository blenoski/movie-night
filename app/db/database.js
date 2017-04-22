const fs = require('fs')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = `${DB_PATH}/movieDB.json`

// TODO: batch database updates

module.exports = {
  addOrUpdateMovie: function addOrUpdateMovie (movie) {
    let changed = false

    let movieDB = loadDatabase()
    const document = findInternal('imdbID', movie.imdbID, movieDB)
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
