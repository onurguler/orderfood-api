const express = require('express');
const httpStatus = require('http-status');
const config = require('./config');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const routes = require('./routes/v1');

const app = express();

app.use(express.json());

app.set('port', config.port);

app.get('/', (req, res) => {
  res.send('API is running.');
});

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
