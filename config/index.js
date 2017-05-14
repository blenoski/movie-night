const fs = require('fs')
const path = require('path')

// This is where we store application data which is OS dependent behavior.
// TODO: get this from electron API
const appDataPath = path.resolve(__dirname, '..', 'appdata')

// We will need to make the application data directory
// at startup if it doesn't already exist. This needs to happen
// BEFORE any logging is tried.
try {
  fs.mkdirSync(appDataPath)
} catch (err) {
  if (err && err.code !== 'EEXIST') { // OK if directory already exists
    throw new Error(`Creating ${appDataPath} failed: ${err}`)
  }
}

// This is where we will store poster images for movies.
const posterImagePath = path.join(appDataPath, 'image')

// This is where we will store the database files.
const dbPath = path.join(appDataPath, 'database')

// This is the name of the database.
const dbName = 'movieDB.json'

// This is where we will store application log files.
const logPath = path.join(appDataPath, 'logs')

// This is logfile basename
const logName = 'movie_night.log'

module.exports = {
  appDataPath,
  dbPath,
  dbName,
  logPath,
  logName,
  posterImagePath
}
