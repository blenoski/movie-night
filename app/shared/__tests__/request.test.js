'use strict'
const fs = require('fs')
const path = require('path')

const request = require('../request')
const { ExtendableError } = require('../utils')
const {
  XHRMockSuccess,
  XHRMock404NotFound,
  XHRMockNetworkError,
  XHRMockTimeoutError,
  XHRMockJSON,
  jsonTestOutput,
  XHRMockGetFirstSuccess
} = require('../__mocks__/XHRMock')

/* globals describe, test, expect, beforeAll, afterAll, beforeEach */
describe('request', () => {
  const url = 'http://example.com'

  describe('error classes', () => {
    test('NetworkError', () => {
      const message = 'network error'
      const networkError = new request.NetworkError(message, url)
      expect(networkError).toBeInstanceOf(request.NetworkError)
      expect(networkError.name).toBe('NetworkError')
      expect(networkError.message).toBe(message)
      expect(networkError.url).toBe(url)
    })

    test('StatusError', () => {
      const httpStatus = 200
      const httpMessage = 'OK'
      const statusError = new request.StatusError(httpStatus, httpMessage, url)
      expect(statusError).toBeInstanceOf(request.StatusError)
      expect(statusError.name).toBe('StatusError')
      expect(statusError.status).toBe(httpStatus)
      expect(statusError.statusText).toBe(httpMessage)
      expect(statusError.url).toBe(url)
    })

    test('TimeoutError', () => {
      const message = 'timeout error'
      const timeoutError = new request.TimeoutError(message, url)
      expect(timeoutError).toBeInstanceOf(request.TimeoutError)
      expect(timeoutError.name).toBe('TimeoutError')
      expect(timeoutError.message).toBe(message)
      expect(timeoutError.url).toBe(url)
    })
  })

  describe('get', () => {
    test('200 OK', (done) => {
      expect.assertions(5)

      request.setRequestAgent(XHRMockSuccess)
      request.get(url).then((response) => {
        // This tests open() was called with correct params.
        // Relies on the Jest mock magic to capture calls.
        expect(response.calls[0]).toContain('GET', url)

        // This tests expected success behavior.
        // Relis on the Jest mock magic to capture instance data.
        const req = response.instances[0]
        expect(req.status).toBe(200)
        expect(req.statusText).toBe('OK')
        expect(req.responseType).toBeNull()
        expect(req.timeout).toBe(30000)

        done()
      })
    })

    test('set responseType', (done) => {
      expect.assertions(1)
      request.setRequestAgent(XHRMockSuccess)
      request.get(url, { responseType: 'arraybuffer' }).then((response) => {
        expect(response.instances[0].responseType).toBe('arraybuffer')
        done()
      })
    })

    test('set timeout', (done) => {
      expect.assertions(1)
      request.setRequestAgent(XHRMockSuccess)
      request.get(url, { timeoutInMilliseconds: 1000 }).then((response) => {
        expect(response.instances[0].timeout).toBe(1000)
        done()
      })
    })

    test('404 Not Found', (done) => {
      expect.assertions(4)

      request.setRequestAgent(XHRMock404NotFound)
      request.get(url).then().catch((err) => {
        expect(err).toBeInstanceOf(request.StatusError)
        expect(err.status).toBe(404)
        expect(err.statusText).toBe('Not Found')
        expect(err.url).toBe(url)

        done()
      })
    })

    test('NetworkError', (done) => {
      expect.assertions(2)

      request.setRequestAgent(XHRMockNetworkError)
      request.get(url).then().catch((err) => {
        expect(err).toBeInstanceOf(request.NetworkError)
        expect(err.url).toBe(url)

        done()
      })
    })

    test('TimeoutError', (done) => {
      expect.assertions(2)

      request.setRequestAgent(XHRMockTimeoutError)
      request.get(url).then().catch((err) => {
        expect(err).toBeInstanceOf(request.TimeoutError)
        expect(err.url).toBe(url)

        done()
      })
    })

    test('rejects on RateLimiter error', () => {
      request.setRequestAgent(XHRMockSuccess)
      require('../../../__mocks__/limiter').setSimulateErrorOnce()
      return expect(request.get(url)).rejects.toBeInstanceOf(Error)
    })
  })

  describe('getJSON', () => {
    beforeAll(() => {
      request.setRequestAgent(XHRMockJSON)
    })

    test('returns parsed JSON data', () => {
      return expect(request.getJSON(url)).resolves.toEqual(jsonTestOutput)
    })

    test('resolves on valid data', () => {
      return expect(request.getJSON(url, () => {}))
        .resolves.toEqual(jsonTestOutput)
    })

    test('rejects on invalid data', () => {
      return expect(request.getJSON(url, () => { throw new Error() }))
        .rejects.toBeInstanceOf(Error)
    })
  })

  describe('getFirstSuccess', () => {
    beforeEach(() => {
      request.setRequestAgent(XHRMockGetFirstSuccess)
    })

    // We will use this validator to identify *** good *** test urls.
    class DataError extends ExtendableError {}
    const validator = (data) => {
      if (!data.includes('succeeds')) {
        throw new DataError('bad data')
      }
    }

    // Convenience function for creating URL arrays from integer arrays.
    const succeeds = 'http://succeeds.com'
    const fails = 'http://fails.com'
    const getUrls = (results) => {
      return results.map((result, index) => {
        return result ? `${succeeds}?index=${index}` : fails
      })
    }

    // Lets get to testing.
    test('resolves when first url is good', () => {
      const expected = `${succeeds}?index=0`
      return expect(request.getFirstSuccess(getUrls([1, 0, 0]), validator))
        .resolves.toEqual({ data: expected, url: expected })
    })

    test('resolves when last url is good', () => {
      const expected = `${succeeds}?index=2`
      return expect(request.getFirstSuccess(getUrls([0, 0, 1]), validator))
        .resolves.toEqual({ data: expected, url: expected })
    })

    test('resolves with first of multiple good urls', () => {
      const expected = `${succeeds}?index=1`
      return expect(request.getFirstSuccess(getUrls([0, 1, 1]), validator))
        .resolves.toEqual({ data: expected, url: expected })
    })

    test('rejects when all urls are bad', () => {
      return expect(request.getFirstSuccess(getUrls([0, 0, 0]), validator))
        .rejects.toBeInstanceOf(DataError)
    })

    test('rejects on a single bad url', () => {
      return expect(request.getFirstSuccess(getUrls([0]), validator))
        .rejects.toBeInstanceOf(DataError)
    })

    test('rejects on empty input', () => {
      return expect(request.getFirstSuccess([]))
        .rejects.toBeInstanceOf(Error)
    })

    test('rejects on NetworkError', () => {
      request.setRequestAgent(XHRMockNetworkError)
      return expect(request.getFirstSuccess(getUrls([1, 1, 1]), validator))
        .rejects.toBeInstanceOf(request.NetworkError)
    })

    test('rejects on StatusError', () => {
      request.setRequestAgent(XHRMock404NotFound)
      return expect(request.getFirstSuccess(getUrls([0, 0, 0]), validator))
        .rejects.toBeInstanceOf(request.StatusError)
    })

    test('rejects on TimeoutError', () => {
      request.setRequestAgent(XHRMockTimeoutError)
      return expect(request.getFirstSuccess(getUrls([1, 1, 1]), validator))
        .rejects.toBeInstanceOf(request.TimeoutError)
    })
  })

  describe('downloadFile', () => {
    const testfile = path.join(__dirname, 'testdownloadfile')

    test('resolves and writes file on good url', () => {
      request.setRequestAgent(XHRMockJSON)
      return expect(request.downloadFile(url, testfile))
        .resolves.toBeUndefined()
    })

    test('rejects on bad url', () => {
      request.setRequestAgent(XHRMock404NotFound)
      return expect(request.downloadFile(url, testfile))
        .rejects.toBeInstanceOf(request.StatusError)
    })

    afterAll(() => {
      try {
        fs.unlinkSync(testfile)
      } catch (err) {
        ;
      }
    })
  })
})
