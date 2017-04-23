const path = require('path')

// This is where we store application data which is OS dependent behavior.
// TODO: get this from electron API
const appDataPath = '/Users/blenoski/Developer/ConfidentCruiser/confident-cruiser/movie-night/appdata'

// This is where we will store poster images for movies.
const posterImagePath = path.join(appDataPath, 'image')

// This is where we will store the database files.
const dbPath = path.join(appDataPath, 'database')

// This is the name of the database.
const dbName = 'movieDB.json'

module.exports = {
  dbPath,
  dbName,
  posterImagePath
}
