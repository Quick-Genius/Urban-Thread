import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ level, message, timestamp, stack }) =>
    `${timestamp} [${level}]: ${(stack as string) || message}`,
  ),
);

const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  format: isProd ? prodFormat : devFormat,
  transports: [
    new transports.Console(),
    ...(isProd
      ? [
          new transports.File({
            filename: path.join(__dirname, '..', 'logs', 'error.log'),
            level: 'error',
            maxsize: 10 * 1024 * 1024,
            maxFiles: 5,
          }),
          new transports.File({
            filename: path.join(__dirname, '..', 'logs', 'combined.log'),
            maxsize: 20 * 1024 * 1024,
            maxFiles: 10,
          }),
        ]
      : []),
  ],
  exitOnError: false,
});

export default logger;
