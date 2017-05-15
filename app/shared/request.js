const { RateLimiter } = require('limiter')
const { writeFile, ExtendableError } = require('./utils')

// We will limit all network requests to a maximum of 80 per 10 seconds.
// Note: Chromium will additionally limit the maximum number of concurrent
// open requests from an origin to 6 as of April 2017.
const eightyRequestsPer = 80
const tenSeconds = 10 * 1000 // time in milliseconds
let limiter = new RateLimiter(eightyRequestsPer, tenSeconds)

// Requests are rejected with NetworkError when the network connection has
// issues or the request times out.
class NetworkError extends ExtendableError {
  constructor (message, url) {
    super(message)
    this.url = url
  }
}

// Requests are rejected with TimeoutError when the request duration exceeds
// the maximum duration allowed
class TimeoutError extends ExtendableError {
  constructor (message, url) {
    super(message)
    this.url = url
  }
}

// Requests are rejected with StatusError when the response is anything
// but 200 OK.
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
function get (url, {
  responseType = null, // set a custom responseType
  timeoutInMilliseconds = 30 * 1000, // specify the request timeout
  retries = 2 // number of retry attempts for Network and/or Timeout errors
} = {}) {
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

      // Do not wait forever
      req.timeout = timeoutInMilliseconds
      req.ontimeout = () => {
        const msg = `Request timed out after ${timeoutInMilliseconds} milliseconds`
        reject(new TimeoutError(msg, url))
      }

      // Make the request
      req.send()
    })
  })
  .catch((err) => {
    if (retries > 0 && (err instanceof TimeoutError || err instanceof NetworkError)) {
      retries -= 1
      return get(url, { responseType, timeoutInMilliseconds, retries })
    } else {
      throw err
    }
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
// Successful response returns {data, url} => JSON data and successful url.
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
            resolve({data, url}) // SUCCESS!
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
  return get(url, {responseType: 'arraybuffer'}) // required XHR2 responseType for binary data
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
