const { logger } = require('../shared/logger.js')

const doLog = ({ sender, severity, message, obj }) => {
  if (obj) {
    logger[severity](`[${sender}] ${message}`, obj)
  } else {
    logger[severity](`[${sender}] ${message}`)
  }
}

const sender = 'main'
const logMain = (severity, message, obj) => doLog({ sender, severity, message, obj })

module.exports = {
  log (logMessage) { doLog(logMessage) },
  debug (message, obj) { logMain('debug', message, obj) },
  info (message, obj) { logMain('info', message, obj) },
  warn (message, obj) { logMain('warn', message, obj) },
  error (message, obj) { logMain('error', message, obj) }
}
