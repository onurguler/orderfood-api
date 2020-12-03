const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const asyncHandler = require('express-async-handler');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config');

module.exports = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please log in to get access.');
  }

  const decoded = jwt.verify(token, config.jwt.secret);

  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'The user belonging to this token does no longer exists.');
  }

  req.user = user;

  next();
});
