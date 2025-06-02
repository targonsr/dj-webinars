const { faker } = require('@faker-js/faker');

function generateFileSystemLog({ host, level, user }) {
  const actions = ['upload', 'download', 'delete', 'move', 'rename'];
  const action = faker.helpers.arrayElement(actions);
  const status = level === 'error' ? 'failure' : 'success';
  const fileNames = [
    faker.system.fileName(),
    faker.system.fileName(),
    faker.system.fileName()
  ];
  const fileName = faker.helpers.arrayElement(fileNames);
  const storage = faker.helpers.arrayElement(['s3', 'gcs', 'azure_blob', 'local']);
  const isError = status === 'failure';

  return {
    opType: 'fs',
    action,
    fileName,
    userId: user,
    storage,
    sizeBytes: faker.number.int({ min: 100, max: 5_000_000 }),
    status,
    error: isError ? faker.lorem.sentence() : undefined,
    level,
    host,
    timestamp: undefined, // will be set by log-generator
  };
}

module.exports = { generateFileSystemLog }; 