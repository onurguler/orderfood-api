const express = require('express');
const config = require('./config');

const app = express();

app.set('port', config.port);

app.get('/', (req, res) => {
  res.send('API is running.');
});

module.exports = app;
