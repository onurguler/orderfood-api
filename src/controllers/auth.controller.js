const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { User } = require('../models');

exports.register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = new User({ name, username, email, password });
  await user.save();
  res.status(httpStatus.CREATED).json({ user });
});
