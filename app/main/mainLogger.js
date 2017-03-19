const winston = require('winston')
const { initLogger } = require('../shared/Logger.js')

const loggerName = 'main'
initLogger(loggerName)

module.exports = winston.loggers.get(loggerName)
