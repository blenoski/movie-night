const winston = require('winston')
const { initLogger } = require('../shared/logger.js')

const loggerName = 'main'
initLogger(loggerName)

module.exports = winston.loggers.get(loggerName)
