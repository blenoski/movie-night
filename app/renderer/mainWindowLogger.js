import winston from 'winston'
import { initLogger } from '../shared/Logger.js'

const loggerName = 'mainWindow'
initLogger(loggerName)

const logger = winston.loggers.get(loggerName)
export default logger
