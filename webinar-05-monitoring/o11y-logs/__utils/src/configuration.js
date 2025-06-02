const { faker } = require('@faker-js/faker');

const HOST_COUNT = parseInt(process.env.HOST_COUNT, 10) || 5;
const DB_CONNECTION_COUNT = parseInt(process.env.DB_CONNECTION_COUNT, 10) || 4;
const USER_COUNT = parseInt(process.env.USER_COUNT, 10) || 500;
const JOB_COUNT = parseInt(process.env.JOB_COUNT, 10) || 1;
const JOB_NAME = process.env.JOB_NAME || 'job';

const service = process.env.SERVICE;
const environment = process.env.ENVIRONMENT;
const getLabels = () => ({ service, environment });

// Pre-generate hosts, DB connections, and users
const HOSTS = Array.from({ length: HOST_COUNT }, () => faker.internet.domainName());
const DB_CONNECTIONS = Array.from({ length: DB_CONNECTION_COUNT }, () => `${faker.internet.ipv4()}:${faker.number.int({ min: 1000, max: 9999 })}`);
const USERS = Array.from({ length: USER_COUNT }, () => faker.internet.username());

// Generate job names
const JOB_NAMES = Array.from({ length: JOB_COUNT }, (_, i) => `${JOB_NAME}-${i + 1}`);

// Assign random traffic shares to each job (sum to 1.0)
function randomShares(count) {
  let points = Array.from({ length: count - 1 }, () => Math.random()).sort();
  let shares = [];
  let prev = 0;
  for (let i = 0; i < points.length; i++) {
    shares.push(points[i] - prev);
    prev = points[i];
  }
  shares.push(1 - prev);
  return shares;
}
const JOB_SHARES = randomShares(JOB_COUNT);
const JOB_NAME_SHARES = JOB_NAMES.map((name, i) => ({ name, share: JOB_SHARES[i] }));

// Traffic profile parameters
const DAY_START = 6; // 6am
const DAY_END = 22; // 10pm
const EVENING_PEAK_START = 18; // 6pm
const EVENING_PEAK_END = 22; // 10pm
const NIGHT_LOW = 0.1; // 10% of base traffic at night
const DAY_BASE = 1.0;
const EVENING_PEAK = 2.0; // 2x base traffic in evening
const PEAK_PROB = 0.08; // 8% chance to start a peak
const PEAK_MIN = 10 * 60 * 1000; // 10 min
const PEAK_MAX = 40 * 60 * 1000; // 40 min
const LOG_LEVELS = ['info', 'warn', 'error'];

let currentPeak = null;

function getRandomHost() {
  return HOSTS[Math.floor(Math.random() * HOSTS.length)];
}

function getRandomDbConnection() {
  return DB_CONNECTIONS[Math.floor(Math.random() * DB_CONNECTIONS.length)];
}

function getRandomUser() {
  return USERS[Math.floor(Math.random() * USERS.length)];
}

function getTrafficMultiplier(hour) {
  if (hour >= EVENING_PEAK_START && hour < EVENING_PEAK_END) return EVENING_PEAK;
  if (hour >= DAY_START && hour < EVENING_PEAK_START) return DAY_BASE;
  return NIGHT_LOW;
}

function maybeStartPeak(now) {
  if (!currentPeak && Math.random() < PEAK_PROB) {
    currentPeak = {
      type: Math.random() < 0.5 ? 'error' : 'warn',
      start: now,
      end: now + (PEAK_MIN + Math.random() * (PEAK_MAX - PEAK_MIN)),
    };
  }
}

function getLogLevel(now) {
  if (currentPeak && now >= currentPeak.start && now <= currentPeak.end) {
    return currentPeak.type;
  }
  // 5% error, 10% warn, rest info
  const r = Math.random();
  if (r < 0.05) return 'error';
  if (r < 0.15) return 'warn';
  return 'info';
}

function advancePeak(now) {
  if (currentPeak && now > currentPeak.end) {
    currentPeak = null;
  }
}

function generateTimestamps(count, periodDays = 6) {
  // Distribute timestamps over the last periodDays, with day/night cycles and peaks
  const now = Date.now();
  const periodMs = periodDays * 24 * 60 * 60 * 1000;
  const start = now - periodMs;
  const timestamps = [];
  let t = start;
  let logsLeft = count;
  while (logsLeft > 0) {
    const date = new Date(t);
    const hour = date.getHours();
    const multiplier = getTrafficMultiplier(hour);
    // More logs during high traffic
    const logsThisHour = Math.max(1, Math.round(multiplier * (count / (periodDays * 24))));
    for (let i = 0; i < logsThisHour && logsLeft > 0; i++) {
      timestamps.push(t * 1e6); // nanoseconds for Loki
      logsLeft--;
    }
    t += 60 * 60 * 1000; // advance 1 hour
  }
  // Shuffle timestamps for realism
  for (let i = timestamps.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [timestamps[i], timestamps[j]] = [timestamps[j], timestamps[i]];
  }
  return timestamps.slice(0, count);
}

function getJobAndHost(batchCount, jobShares = JOB_NAME_SHARES, hostList = HOSTS) {
  // Assign jobs according to shares
  let jobCounts = jobShares.map(s => Math.floor(s.share * batchCount));
  let remainder = batchCount - jobCounts.reduce((a, b) => a + b, 0);
  while (remainder > 0) {
    const idx = Math.floor(Math.random() * jobCounts.length);
    jobCounts[idx]++;
    remainder--;
  }
  let jobs = [];
  jobShares.forEach((s, i) => {
    for (let j = 0; j < jobCounts[i]; j++) jobs.push(s.name);
  });
  // Shuffle jobs
  for (let i = jobs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jobs[i], jobs[j]] = [jobs[j], jobs[i]];
  }
  // Assign hosts randomly to each batch
  let hosts = [];
  for (let i = 0; i < batchCount; i++) {
    hosts.push(hostList[Math.floor(Math.random() * hostList.length)]);
  }
  // Return array of { job, host }
  return jobs.map((job, i) => ({ job, host: hosts[i] }));
}

module.exports = {
  getRandomHost,
  getRandomDbConnection,
  getRandomUser,
  getLogLevel,
  maybeStartPeak,
  advancePeak,
  generateTimestamps,
  HOSTS,
  DB_CONNECTIONS,
  USERS,
  JOB_NAMES,
  JOB_NAME_SHARES,
  getLabels,
  getJobAndHost,
}; 