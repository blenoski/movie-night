const winston = require('winston')

// Override default log level with LOG_LEVEL env variable
const levels = ['error', 'warn', 'warning', 'info', 'verbose', 'debug', 'silly']
let override = process.env.LOG_LEVEL
let defaultLevel = (override && levels.indexOf(override) > -1)
  ? override
  : 'info'

const initLogger = (callingProcess) => {
  // Set-up the logger.
  // Using a single logger across processes appears to work fine.
  winston.loggers.add(callingProcess, {
    console: {
      label: callingProcess,
      colorize: true,
      timestamp: true,
      level: defaultLevel,
      humanReadableUnhandledException: true
    },
    file: {
      filename: './logs/log.txt',
      label: callingProcess,
      timestamp: true,
      json: false,
      level: defaultLevel,
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
