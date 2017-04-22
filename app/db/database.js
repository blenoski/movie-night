const fs = require('fs')

const APPDATA_PATH = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'
const DB_PATH = `${APPDATA_PATH}/database`
const dbFile = `${DB_PATH}/movieDB.json`

// TODO: batch database updates
// TODO: generalize database

const uniqueField = 'imdbID'

module.exports = {
  addOrUpdateDocument: function addOrUpdateDocument (document) {
    let db = loadDatabase()

    let documentIndex = findIndexInternal(uniqueField, document[uniqueField], db)
    if (documentIndex >= 0) {
      db[documentIndex] = document // update existing document
    } else {
      db.push(document) // add new document
    }

    persistToFile(db)
    return db
  },

  findOne: function findOne (filterFcn) {
    const db = loadDatabase()
    return db.find((document) => {
      return filterFcn(document)
    })
  },

  find: function find (filterFcn) {
    const db = loadDatabase()
    return db.filter((document) => {
      return filterFcn(document)
    })
  },

  findByID: function findByID (id) {
    const db = loadDatabase()
    return findInternal(uniqueField, id, db)
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

function findInternal (key, value, db) {
  return db.find((document) => {
    return document[key] === value
  })
}

function findIndexInternal (key, value, db) {
  return db.findIndex((document) => {
    return document[key] === value
  })
}

function persistToFile (db) {
  try {
    fs.mkdirSync(DB_PATH)
  } catch (err) {
    if (err && err.code !== 'EEXIST') { // OK if directory already exists
      console.log(err)
      throw err
    }
  }

  const json = JSON.stringify(db)
  const tmpFile = `${dbFile}.tmp`
  fs.writeFileSync(tmpFile, json)
  fs.renameSync(tmpFile, dbFile) // overwrites old DB with just created one
}
