const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (metadata && Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ]
});

module.exports = logger;