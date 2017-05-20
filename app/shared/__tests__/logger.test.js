'use strict'
const path = require('path')
const winston = require('winston') // jest uses mocked version automatically
const { logPath, logName } = require('../../../config')
const { initLogger, defaultLevel } = require('../logger')

/* globals describe, test, expect */
describe('logger', () => {
  test('initialized with both console and file loggers', () => {
    const loggerName = 'test-logger'
    process.env.LOG_LEVEL = 'warn'
    initLogger(loggerName)

    // Expecting winston to get configured with file and console loggers.
    const call = winston.loggers.add.mock.calls[0]
    expect(call[0]).toEqual(loggerName)

    const transports = call[1]
    expect(transports).toHaveProperty('console')
    expect(transports).toHaveProperty('file')

    const consoleLogger = transports.console
    expect(consoleLogger).toHaveProperty('label', loggerName)
    expect(consoleLogger).toHaveProperty('level', 'warn')

    const fileLogger = transports.file
    expect(fileLogger).toHaveProperty('label', loggerName)
    expect(fileLogger).toHaveProperty('filename', path.join(logPath, logName))
    expect(fileLogger).toHaveProperty('level', 'warn')
  })

  test('log level environment variable overrides', () => {
    const levels = ['error', 'warn', 'warning', 'info', 'verbose', 'debug']
    levels.forEach(level => {
      process.env.LOG_LEVEL = level
      expect(defaultLevel()).toBe(level)
    })
  })
})
