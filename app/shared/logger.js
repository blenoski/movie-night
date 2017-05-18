const path = require('path')
const winston = require('winston')
const { logPath, logName } = require('../../config')

// Override default log level with LOG_LEVEL env variable
const levels = ['error', 'warn', 'warning', 'info', 'verbose', 'debug', 'silly']
const defaultLevel = () => {
  let override = process.env.LOG_LEVEL
  return (override && levels.indexOf(override) > -1)
    ? override
    : 'info'
}

const initLogger = (callingProcess) => {
  winston.loggers.add(callingProcess, {
    console: {
      label: callingProcess,
      colorize: true,
      timestamp: true,
      level: defaultLevel(),
      humanReadableUnhandledException: true
    },
    file: {
      filename: path.join(logPath, logName),
      label: callingProcess,
      timestamp: true,
      json: false,
      level: defaultLevel(),
      maxsize: (1024 * 1024 * 10), // 10 MB
      maxFiles: 5, // So 50 MB max
      tailable: true,
      zippedArchive: true
    }
  })
}

module.exports = {
  initLogger
}
