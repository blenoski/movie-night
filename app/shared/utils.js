const fs = require('fs')

const isDevEnv = () => {
  return process.env.NODE_ENV === 'development'
}

const getPlatform = () => {
  return process.platform
}

const logEnv = (logger) => {
  logger.info('', {
    'NODE_ENV': process.env.NODE_ENV,
    'LOG_LEVEL': process.env.LOG_LEVEL
  })
}

// Promise wrapper for fs.mkdir
// Ignore directory already exists error.
function mkdir (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err && err.code !== 'EEXIST') { // OK if directory already exists
        reject(new Error(err))
      }
      resolve()
    })
  })
}

// Promise wrapper for fs.writeFile
function writeFile (fname, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fname, data, (err) => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    })
  })
}

// Promise wrapper for fs.readdir
function readdir (directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, items) => {
      if (err) {
        reject(new Error(err))
      }
      resolve(items)
    })
  })
}

// Promise wrapper for fs.lstat
function lstat (absPath) {
  return new Promise((resolve, reject) => {
    fs.lstat(absPath, (err, stats) => {
      if (err) {
        reject(new Error(err))
      }
      resolve(stats)
    })
  })
}

// Determine whether or not provided file exists.
function fileExists (fname) {
  return new Promise((resolve, reject) => {
    return lstat(fname)
      .then((stats) => {
        resolve(stats.isFile())
      })
      .catch(() => {
        resolve(false)
      })
  })
}

// Splits a collection into a size x size grid.
// If the split is uneven, the last row will
// have less than size elements
function gridPartition (items, size) {
  const grid = items.reduce((result, item) => {
    const index = result.length - 1
    if (result[index].length < size) {
      result[index].push(item)
    } else {
      result.push([item])
    }
    return result
  }, [ [] ])

  return grid
}

function ExtendableError (message) {
  this.name = this.constructor.name
  this.message = message || 'error'
  this.stack = (new Error()).stack
}
ExtendableError.prototype = Object.create(Error.prototype)
ExtendableError.prototype.constructor = ExtendableError

module.exports = {
  isDevEnv,
  getPlatform,
  logEnv,
  mkdir,
  writeFile,
  readdir,
  lstat,
  fileExists,
  gridPartition,
  ExtendableError
}
