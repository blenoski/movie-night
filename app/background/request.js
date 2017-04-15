class ExtendableError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

class NetworkError extends ExtendableError {
  constructor (message, url) {
    super(message)
    this.url = url
  }
}

class StatusError extends ExtendableError {
  constructor (status, statusText, url) {
    super(`${status}: ${statusText}`)
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

function get (url) {
  // Return a new promise.
  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest() /* global XMLHttpRequest */
    req.open('GET', url)

    req.onload = function () {
      // This is called even on 404 etc
      // so check the status
      if (req.status === 200) {
        // Resolve the promise with the response text
        resolve(req.response)
      } else {
        // Otherwise reject with the status and status text
        // which will hopefully be a meaningful error
        reject(new StatusError(req.status, req.statusText, url))
      }
    }

    // Handle network errors
    req.onerror = function () {
      reject(new NetworkError('Network error', url))
    }

    // Make the request
    req.send()
  })
}

function getJSON (url) {
  return get(url).then(JSON.parse)
}

module.exports = {
  get,
  getJSON,
  StatusError,
  NetworkError
}
