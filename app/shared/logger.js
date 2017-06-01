const path = require('path')
const logger = require('electron-log')
const { logPath, logName } = require('../../config')

// Override default log level with LOG_LEVEL env variable
const levels = ['error', 'warn', 'info', 'debug']
const defaultLevel = () => {
  let override = process.env.LOG_LEVEL
  return (override && levels.indexOf(override) > -1)
    ? override
    : 'info'
}

logger.transports.console.level = defaultLevel()
logger.transports.file.level = defaultLevel()
logger.transports.file.file = path.join(logPath, logName)
logger.transports.file.maxSize = 5 * 1024 * 1024 // 5 MB

module.exports = {
  logger,
  defaultLevel
}
