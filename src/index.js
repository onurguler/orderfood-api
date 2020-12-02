const app = require('./app');
const logger = require('./config/logger');

app.listen(app.get('port'), () => {
  logger.info(`Server is running on http://localhost:${app.get('port')}`);
});
