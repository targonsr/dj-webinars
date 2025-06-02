const { faker } = require('@faker-js/faker');
const { generateHttpLog, generateAppLog } = require('./generator.http');
const { generateDbQueryLog } = require('./generator.db');
const { generateRedisCacheLog } = require('./generator.cache');
const { generateFileSystemLog } = require('./generator.fs');
const config = require('./configuration');

const MIN_LOGS = parseInt(process.env.MIN_LOGS, 10) || 200;
const MAX_LOGS = parseInt(process.env.MAX_LOGS, 10) || 400;
const LOG_COUNT = MIN_LOGS + Math.floor(Math.random() * (MAX_LOGS - MIN_LOGS + 1));
const BATCH_MIN = 5;
const BATCH_MAX = 15;
const DELAY = 150 + Math.random() * 150; // ms

const generators = [
  (opts) => generateHttpLog(opts),
  (opts) => generateAppLog(opts),
  (opts) => generateDbQueryLog(opts),
  (opts) => generateRedisCacheLog(opts),
  (opts) => generateFileSystemLog(opts),
];

function formatLogEntry(fields, timestampNs) {
  const msg = fields.msg || fields.message || fields.action || fields.operation || fields.command || fields.eventType || 'log';
  const text = (fields.level ? fields.level.toUpperCase() + ': ' : '') + msg;
  const logfmt = Object.entries(fields)
    .map(([k, v]) => {
      if (typeof v === 'string' && v.includes(' ')) {
        return `${k}='${v}'`;
      }
      return `${k}=${v}`;
    })
    .join(' ');
  const json = JSON.stringify({ timestamp: new Date(Number(timestampNs) / 1e6).toISOString(), ...fields });
  return { text, logfmt, json };
}

function* batchLogs(logs, minSize = BATCH_MIN, maxSize = BATCH_MAX) {
  let i = 0;
  while (i < logs.length) {
    const batchSize = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
    yield logs.slice(i, i + batchSize);
    i += batchSize;
  }
}

function assignLogsToJobs(total, jobShares) {
  let counts = jobShares.map(s => Math.floor(s.share * total));
  let remainder = total - counts.reduce((a, b) => a + b, 0);
  while (remainder > 0) {
    const idx = Math.floor(Math.random() * counts.length);
    counts[idx]++;
    remainder--;
  }
  let jobs = [];
  jobShares.forEach((s, i) => {
    for (let j = 0; j < counts[i]; j++) jobs.push(s.name);
  });
  for (let i = jobs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jobs[i], jobs[j]] = [jobs[j], jobs[i]];
  }
  return jobs;
}

function getBatchLabels(job) {
  return { ...config.getLabels(), job };
}

module.exports = function strategyRealistic() {
  const timestamps = config.generateTimestamps
    ? config.generateTimestamps(LOG_COUNT, 6)
    : Array.from({ length: LOG_COUNT }, () => Date.now() * 1e6);
  let logs = [];
  for (let i = 0; i < LOG_COUNT; i++) {
    const timestamp = timestamps[i];
    config.maybeStartPeak && config.maybeStartPeak(timestamp / 1e6);
    const host = config.getRandomHost ? config.getRandomHost() : config.HOSTS[Math.floor(Math.random() * config.HOSTS.length)];
    const connection = config.getRandomDbConnection ? config.getRandomDbConnection() : config.DB_CONNECTIONS[Math.floor(Math.random() * config.DB_CONNECTIONS.length)];
    const user = config.getRandomUser ? config.getRandomUser() : config.USERS[Math.floor(Math.random() * config.USERS.length)];
    const level = config.getLogLevel ? config.getLogLevel(timestamp / 1e6) : ['info', 'warn', 'error'][Math.floor(Math.random() * 3)];
    const gen = generators[Math.floor(Math.random() * generators.length)];
    const opts = { host, connection, level, user };
    const entry = gen(opts);
    if (config.advancePeak) config.advancePeak(timestamp / 1e6);
    const formatted = formatLogEntry(entry, timestamp);
    logs.push([timestamp.toString(), formatted.json]);
  }
  logs.sort((a, b) => (BigInt(a[0]) > BigInt(b[0]) ? 1 : -1));
  const allBatches = Array.from(batchLogs(logs));
  const batchCount = allBatches.length;
  const jobHostAssignments = config.getJobAndHost(batchCount);
  let batchIdx = 0;
  const batches = [];
  for (const batchLogsArr of allBatches) {
    const { job, host } = jobHostAssignments[batchIdx];
    batches.push({ logs: batchLogsArr, delay: DELAY, meta: { strategy: 'realistic', labels: { ...config.getLabels(), job, host } } });
    batchIdx++;
  }
  return { batches, meta: { strategy: 'realistic', delay: DELAY } };
}; 