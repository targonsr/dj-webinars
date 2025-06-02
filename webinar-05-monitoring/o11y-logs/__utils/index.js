require('dotenv').config();
const { assertEnvVars } = require('./src/env');
const fs = require('fs');

assertEnvVars(
  'LOKI_URL',
  'BASIC_AUTH',
  'GENERATOR_MODE',
  'MIN_LOGS',
  'MAX_LOGS',
  'HOST_COUNT',
  'DB_CONNECTION_COUNT',
  'USER_COUNT',
  'SERVICE',
  'ENVIRONMENT',
  'JOB_COUNT',
  'JOB_NAME',
  'MIN_BATCH_SIZE',
  'MAX_BATCH_SIZE',
);

const outputDir = 'output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

require('./src/run')();
