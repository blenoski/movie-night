const winston = require('winston')
const { initLogger } = require('../shared/Logger.js')

const loggerName = 'backgroundWorker'
initLogger(loggerName)

module.exports = winston.loggers.get(loggerName)
