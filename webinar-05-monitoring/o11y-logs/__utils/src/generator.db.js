const { faker } = require('@faker-js/faker');

function generateDbQueryLog({ host, connection, level, user }) {
  const operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
  const operation = faker.helpers.arrayElement(operations);
  const tables = ['users', 'orders', 'products', 'sessions', 'payments'];
  const table = faker.helpers.arrayElement(tables);
  const isError = level === 'error';

  return {
    opType: 'db',
    operation,
    table,
    sql: `${operation} * FROM ${table} WHERE id = ?`,
    params: [faker.string.uuid()],
    duration: faker.number.int({ min: 1, max: 500 }),
    rowsAffected: operation === 'SELECT' ? faker.number.int({ min: 0, max: 10 }) : faker.number.int({ min: 0, max: 1 }),
    connection,
    host,
    level,
    error: isError ? faker.lorem.sentence() : undefined,
    user,
  };
}

module.exports = { generateDbQueryLog }; 