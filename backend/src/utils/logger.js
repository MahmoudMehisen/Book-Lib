const winston = require('winston');

const { createLogger, format, transports } = winston;
const { combine, colorize, printf } = format;

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === 'development' ? colorize() : format.uncolorize(),
    format.splat(),
    printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
