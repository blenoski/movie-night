const { RateLimiter } = require('limiter')

// We will limit all network requests to a maximum of 40 per 10 seconds.
const period = 10 * 1000 // 10 seconds in millisecosnds
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

// Core function for fetching API data
function get (url) {
  // Return a new promise.
  return new Promise((resolve, reject) => {
    limiter.removeTokens(1, (err, remainingRequests) => {
      if (err) {
        reject(err)
      }

      // Do the usual XHR stuff
      var req = new XMLHttpRequest() /* global XMLHttpRequest */
      req.open('GET', url)

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
// @urls - array of ordered urls
// @validate - function that is called with response data,
//             should throw Error iff data is invalid
function getFirstSuccess (urls, validate = null) {
  return new Promise((resolve, reject) => {
    let settled = false // flag that is set when Promise has been settled

    return urls.reduce((previous, url, index) => {
      return previous.then(() => {
        if (settled) {
          return // this no-ops rest of promise chain
        }

        // No good data yet, so lets try the current url.
        return getJSON(url, validate) // must return async function so it gets added to chain
          .then((data) => {
            resolve(data) // SUCCESS!
            settled = true
          })
          .catch((err) => {
            // On network or status error, reject immediately.
            if (err instanceof NetworkError || err instanceof StatusError) {
              reject(err)
              settled = true
            // If we are out of urls, then reject.
            } else if ((index + 1) === urls.length) {
              reject(err)
              settled = true
            }
          })
      })
    }, Promise.resolve())
  })
}

module.exports = {
  get,
  getJSON,
  getFirstSuccess,
  StatusError,
  NetworkError
}
