'use strict'
const fs = require('fs')
const path = require('path')
const logger = require('./dbLogger')

// Database supports a single NoSQL style collection.
// Documents are required to have a uniqueField property (a.k.a. primary key)
// Fetching documents is not optimized and generally iterates over every document.
// Persistence is file based (JSON) and handled automatically.
// Primary use cases for this database are:
//   - persist JSON data between sessions
//   - handle burst database updates over a short period efficiently
// This database is not intended for use on a user facing process as some operations
// are blocking in order to preserve database integrity.
module.exports = class SingleCollectionDatabase {
  constructor ({ dbPath, dbFile, uniqueField }) {
    this.dbPath = dbPath
    this.dbFile = dbFile
    this.uniqueField = uniqueField
    this.collection = []
    this._persist = { tokens: 0 }

    // Load the database if it already exists.
    try {
      const dbFullFile = path.join(this.dbPath, this.dbFile)
      logger.info(`Loading database: ${dbFullFile}`)
      this.collection = JSON.parse(fs.readFileSync(dbFullFile))
    } catch (err) {
      ;
    }
  }

  // Returns the database configuration.
  config () {
    return {
      dbPath: this.dbPath,
      dbFile: this.dbFile,
      uniqueField: this.uniqueField
    }
  }

  // Add a document to the collection.
  // Overwrites if document with matching uniqueField already exists.
  addOrUpdate (document) {
    let documentIndex = this.collection.findIndex((doc) => {
      return doc[this.uniqueField] === document[this.uniqueField]
    })
    if (documentIndex >= 0) {
      this.collection[documentIndex] = document // update existing document
    } else {
      this.collection.push(document) // add new document
    }

    this._scheduleSave()
    return this.collection
  }

  // Returns the first document matching the supplied function.
  // Returns undefined if no matching documents are found.
  findOne (filterFcn) {
    return this.collection.find((document) => {
      return filterFcn(document)
    })
  }

  // Returns all documents matching the supplied function.
  // Returns empty array if no matching documents are found.
  find (filterFcn) {
    return this.collection.filter((document) => {
      return filterFcn(document)
    })
  }

  // Returns document where document[uniqueField] === id.
  // Returns undefined if no matching document is found.
  findByID (id) {
    return this.collection.find((document) => {
      return document[this.uniqueField] === id
    })
  }

  // Returns the collection as an array of documents.
  getCollection () {
    return this.collection
  }

  // Schedules a save (write to file) 3 seconds in the future.
  // Tokens are used to batch multiple updates into a single save.
  // Warning: if process is ended within 3 seconds of a database update, then
  // that update will be lost.
  _scheduleSave () {
    this._persist.tokens += 1
    setTimeout(persistDatabaseToFile, 3 * 1000, this.dbPath, this.dbFile, this.collection, this._persist)
  }
}

// =========
// Internal
// =========
// Saves the database to a file
function persistDatabaseToFile (dbPath, dbFile, collection, persist) {
  // Take a persist token
  persist.tokens -= 1

  // Early exit if there are outstanding persist tokens.
  // This is how we end up batching multiple updates into a single save.
  if (persist.tokens > 0) {
    return
  }

  // Early exit if the collection is empty
  if (collection.length === 0) {
    return
  }

  // Make the directory if it does not already exist
  try {
    fs.mkdirSync(dbPath)
  } catch (err) {
    if (err && err.code !== 'EEXIST') { // OK if directory already exists
      logger.error(`Creating database folder failed: ${dbPath}`, err)
      throw err
    }
  }

  // Serialize the collection and write to file
  const dbFullFile = path.join(dbPath, dbFile)
  try {
    const json = JSON.stringify(collection)
    const tmpFile = path.join(dbPath, `${dbFile}.tmp`)
    fs.writeFileSync(tmpFile, json)
    fs.renameSync(tmpFile, dbFullFile) // overwrites old DB with just created one
    logger.info(`Saved ${dbFullFile}`, { count: collection.length })
  } catch (err) {
    logger.error(`Save failed: ${dbFullFile}`, err)
    throw err
  }
}
