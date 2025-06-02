// http-scenarios.js
const { faker } = require('@faker-js/faker');

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const STATUS_CODES = [200, 201, 400, 401, 403, 404, 500, 503];
const API_ENDPOINTS = [
  '/api/users',
  '/api/products',
  '/auth/login',
  '/v1/config',
  '/graphql'
];

const generateHttpLog = ({ host, level, user }) => {
  const method = faker.helpers.arrayElement(HTTP_METHODS);
  const status = faker.helpers.arrayElement(STATUS_CODES);
  
  return {
    opType: 'http',
    method,
    status,
    url: `${faker.helpers.arrayElement(API_ENDPOINTS)}/${faker.string.uuid()}`,
    duration: `${faker.number.int({ min: 1, max: 1500 })}ms`,
    host,
    userAgent: faker.internet.userAgent(),
    userId: user,
    clientIp: faker.internet.ipv4(),
    requestId: faker.string.uuid(),
    level,
  };
};

const generateAppLog = ({ host, level, user }) => {
  const logTypes = [
    { type: 'user', action: 'signup' },
    { type: 'user', action: 'login' },
    { type: 'database', action: 'connection_error' },
    { type: 'config', action: 'update' },
    { type: 'payment', action: 'processed' }
  ];

  const template = faker.helpers.arrayElement(logTypes);
  
  return {
    level,
    eventType: template.type,
    action: template.action,
    message: `${template.type} ${template.action} event`,
    userId: user,
    error: level === 'error' ? faker.lorem.sentence() : undefined,
    duration: level === 'error' ? undefined : faker.number.int({ min: 10, max: 5000 }),
    host,
  };
};

module.exports = {
  generateAppLog,
  generateHttpLog
};
