const fs = require('fs')

const isDevEnv = () => {
  return process.env.NODE_ENV === 'development'
}

const logEnv = (logger) => {
  logger.info('', {
    'NODE_ENV': process.env.NODE_ENV,
    'LOG_LEVEL': process.env.LOG_LEVEL
  })
}

function mkdir (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err && err.code !== 'EEXIST') { // OK if directory already exists
        reject(new Error(`Creating directory ${path} failed: ${err}`))
      }
      resolve()
    })
  })
}

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

module.exports = {
  isDevEnv,
  logEnv,
  mkdir,
  writeFile
}
