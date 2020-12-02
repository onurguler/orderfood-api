const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB.');
  app.listen(app.get('port'), () => {
    logger.info(`Server is running on http://localhost:${app.get('port')}`);
  });
});
