'use strict'
const winston = require('winston')
const { initLogger } = require('../logger')

/* globals describe, test, expect */
describe('logger', () => {
  test('defaults to file and console logger with level=info', () => {
    const loggerName = 'test-info'
    process.env.LOG_LEVEL = 'info'
    initLogger(loggerName)
    const logger = winston.loggers.get(loggerName)

    expect(logger.transports).toHaveProperty('file')
    expect(logger.transports.file.level).toBe('info')
    expect(logger.transports).toHaveProperty('console')
    expect(logger.transports.console.level).toBe('info')
  })

  test('level environment variable overrides work', () => {
    const orig = process.env.LOG_LEVEL
    process.env.LOG_LEVEL = 'error'

    const loggerName = 'test-error'
    initLogger(loggerName)
    const logger = winston.loggers.get(loggerName)

    expect(logger.transports).toHaveProperty('file')
    expect(logger.transports.file.level).toBe('error')
    expect(logger.transports).toHaveProperty('console')
    expect(logger.transports.console.level).toBe('error')

    process.env.LOG_LEVEL = orig
  })
})
