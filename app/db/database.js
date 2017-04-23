const fs = require('fs')

// TODO: batch database updates

module.exports = class SingleCollectionDatabase {
  constructor ({ dbPath, dbFile, uniqueField }) {
    this.dbPath = dbPath
    this.dbFile = dbFile
    this.uniqueField = uniqueField
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
  // Overwrites existing if document with matching uniqueField already exists.
  addOrUpdate (document) {
    let db = this.loadDatabase()

    let documentIndex = findIndexInternal(this.uniqueField, document[this.uniqueField], db)
    if (documentIndex >= 0) {
      db[documentIndex] = document // update existing document
    } else {
      db.push(document) // add new document
    }

    persistToFile(db, this.dbPath, this.dbFile)
    return db
  }

  // Returns the first document matching the supplied function.
  // Returns undefined if no matching documents are found.
  findOne (filterFcn) {
    const db = this.loadDatabase()
    return db.find((document) => {
      return filterFcn(document)
    })
  }

  // Returns all documents matching the supplied function.
  // Returns empty array if no matching documents are found.
  find (filterFcn) {
    const db = this.loadDatabase()
    return db.filter((document) => {
      return filterFcn(document)
    })
  }

  // Returns document where document[uniqueField] === id.
  // Returns undefined if no matching document is found.
  findByID (id) {
    const db = this.loadDatabase()
    return findInternal(this.uniqueField, id, db)
  }

  // Returns the collection as an array of documents.
  loadDatabase () {
    if (fs.existsSync(this.dbFile)) {
      return JSON.parse(fs.readFileSync(this.dbFile))
    } else {
      return []
    }
  }
}

// =================
// Internal methods
// =================
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

function persistToFile (db, dbPath, dbFile) {
  try {
    fs.mkdirSync(dbPath)
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
