const winston = require('winston');
const LokiTransport = require("winston-loki");

// Environment variables with fallbacks
const HOSTNAME = require('os').hostname();
const NODE_ENV = process.env.NODE_ENV;
const SERVICE_NAME = process.env.SERVICE_NAME;
const LOKI_HOST = process.env.LOKI_HOST;

// Create the logger
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    service: SERVICE_NAME,
    host: HOSTNAME
  },
  transports: [
    // File transports for production
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),

    // Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
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
      format: winston.format.json(),
      batching: true,
      level: 'debug',
      interval: 5, // seconds
      replaceTimestamp: true,
      clearOnError: false,
      onConnectionError: (err) => console.error('Loki connection error:', err)
    })
  ]
});

module.exports = logger;
