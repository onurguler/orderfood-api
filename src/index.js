const app = require('./app');
const logger = require('./config/logger');
const db = require('./database');

async function assertDatabaseConnectionOk() {
  logger.info('Checking database connection...');
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection OK!');
  } catch (error) {
    logger.warn('Unable to connect to the database:');
    logger.error(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();
  app.listen(app.get('port'), () => {
    logger.info(`Server is running on http://localhost:${app.get('port')}`);
  });
}

init();
