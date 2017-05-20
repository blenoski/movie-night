'use strict'

/* global jest */
const winston = jest.genMockFromModule('winston')

const logger = {
  debug: jest.genMockFunction(),
  info: jest.genMockFunction(),
  warning: jest.genMockFunction(),
  error: jest.genMockFunction()
}

winston.loggers = {
  add: jest.genMockFunction(),
  get: () => logger
}

module.exports = winston
