import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

const HOSTNAME = require('os').hostname();
const NODE_ENV = process.env.NODE_ENV!;
const SERVICE_NAME = process.env.SERVICE_NAME!;
const LOKI_HOST = process.env.LOKI_HOST!;

const logger = createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: {
    service: SERVICE_NAME,
    host: HOSTNAME
  },
  transports: [
    // File transports for production
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'logs/combined.log' 
    }),

    // Console transport for local development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`;
        })
      ),
    }),
    
    // Loki transport for log aggregation
    new LokiTransport({
      host: LOKI_HOST,
      labels: {
        host: HOSTNAME,
        job: SERVICE_NAME,
        service: SERVICE_NAME,
        environment: NODE_ENV
      },
      json: true,
      format: format.json(),
      batching: true,
      level: 'debug',
      interval: 5, // seconds
      replaceTimestamp: true,
      clearOnError: false,
      onConnectionError: (err) => console.error('Loki connection error:', err)
    })
  ],
  exitOnError: false,
});

export default logger;
