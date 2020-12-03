const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { User } = require('../models');
const { tokenService } = require('../services');

/**
 * @route   /api/v1/auth/register
 * @method  POST
 * @desc    Register a new user
 * @access  public
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = new User({ name, username, email, password });
  await user.save();
  const tokens = tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).json({ user, tokens });
});

/**
 * @route   /api/v1/auth/login
 * @method  POST
 * @desc    Login with email and password
 * @access  public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Incorrect email or password.' });
  }
  const tokens = tokenService.generateAuthTokens(user);
  res.json({ user, tokens });
});
