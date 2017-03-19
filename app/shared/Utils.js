const isDevEnv = () => {
  return process.env.NODE_ENV === 'development'
}

const logEnv = (logger) => {
  logger.info('', {
    'NODE_ENV': process.env.NODE_ENV,
    'LOG_LEVEL': process.env.LOG_LEVEL
  })
}

module.exports = {
  isDevEnv,
  logEnv
}
