const { RateLimiter } = require('limiter')
const { writeFile } = require('../shared/utils')

// We will limit all network requests to a maximum of 40 per 10 seconds.
const period = 10 * 1000 // 10 seconds in milliseconds
let limiter = new RateLimiter(40, period)

// Error classes
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

// Core function for making client side GET requests.
// Using XHR as underlying implementation because it handles things like system
// configured proxies, following redirects, and https tunneling automatically.
// Downside to XHR is it does not support streaming.
function get (url, responseType = null) {
  // Return a new promise.
  return new Promise((resolve, reject) => {
    limiter.removeTokens(1, (err, remainingRequests) => {
      if (err) {
        reject(err)
      }

      // Do the usual XHR stuff
      var req = new XMLHttpRequest() /* global XMLHttpRequest */
      req.open('GET', url)
      if (responseType) {
        req.responseType = responseType
      }

      req.onload = () => {
        // This is called even on 404 etc
        // so check the status
        if (req.status === 200) {
          // Resolve the promise with the response data
          resolve(req.response)
        } else {
          // Otherwise reject with the status and status text
          // which will hopefully be a meaningful error
          reject(new StatusError(req.status, req.statusText, url))
        }
      }

      // Handle network errors
      req.onerror = () => {
        reject(new NetworkError('Network error', url))
      }

      // Make the request
      req.send()
    })
  })
}

// Returns structured JSON data from URL.
function getJSON (url, validate = null) {
  return get(url)
    .then((response) => {
      const data = JSON.parse(response)
      if (validate) {
        validate(data) // throws Error on invalid data
      }
      return data
    })
}

// Loop over urls in order.
// Stop on first successful response OR first network/status error.
// Successful response returns JSON data.
// @urls[required] - array of urls to try in order
// @validate[optional] - function that is called with response data,
//                       should throw Error iff data is invalid
function getFirstSuccess (urls, validate = null) {
  return new Promise((resolve, reject) => {
    let settled = false // flag that is set when Promise has been settled

    return urls.reduce((previous, url, index) => {
      return previous.then(() => {
        if (settled) {
          return // this no-ops rest of promise chain
        }

        // No good data yet, so lets try the current url.
        return getJSON(url, validate) // MUST return the promise here so it gets added to chain
          .then((data) => {
            settled = true
            resolve(data) // SUCCESS!
          })
          .catch((err) => {
            // On network or status error, reject immediately.
            if (err instanceof NetworkError || err instanceof StatusError) {
              settled = true
              reject(err)
            // If we are out of urls, then reject.
            } else if ((index + 1) === urls.length) {
              settled = true
              reject(err)
            }
          })
      })
    }, Promise.resolve())
  })
}

function downloadFile (url, fname) {
  return get(url, 'arraybuffer') // required XHR2 responseType for binary data
    .then((arraybuffer) => {
      return writeFile(fname, Buffer.from(arraybuffer))
    })
}

module.exports = {
  get,
  getJSON,
  getFirstSuccess,
  downloadFile,
  StatusError,
  NetworkError
}
