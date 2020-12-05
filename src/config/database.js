const config = require('./config');

module.exports = {
  development: {
    username: config.database.development.username,
    password: config.database.development.password,
    database: config.database.development.database,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: config.database.test.username,
    password: config.database.test.password,
    database: config.database.test.database,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
