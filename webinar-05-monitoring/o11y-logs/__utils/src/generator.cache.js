const { faker } = require('@faker-js/faker');

function generateRedisCacheLog({ host, level, user }) {
  const commands = ['GET', 'SET', 'DEL', 'EXPIRE', 'INCR', 'LPUSH', 'LRANGE'];
  const command = faker.helpers.arrayElement(commands);
  const key = `user:${faker.number.int({ min: 1, max: 1000 })}:session`;
  const isSlow = level === 'warn';
  const durationUs = isSlow
    ? faker.number.int({ min: 100000, max: 2000000 }) // slow log: >100ms
    : faker.number.int({ min: 100, max: 99999 });

  return {
    opType: 'redis',
    command,
    key,
    args: [faker.string.uuid()],
    durationUs,
    clientIp: faker.internet.ipv4(),
    result: command === 'GET'
      ? faker.helpers.arrayElement(['hit', 'miss'])
      : 'ok',
    level,
    host,
    user,
    timestamp: undefined, // will be set by log-generator
  };
}

module.exports = { generateRedisCacheLog }; 