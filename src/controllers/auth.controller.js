const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { tokenTypes } = require('../config/tokens');
const { User } = require('../models');
const { tokenService } = require('../services');
const ApiError = require('../utils/ApiError');

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
  const tokens = await tokenService.generateAuthTokens(user);
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
  const tokens = await tokenService.generateAuthTokens(user);
  res.json({ user, tokens });
});

/**
 * @route   /api/v1/auth/refresh
 * @method  POST
 * @desc    Refresh auth tokens
 * @access  public
 */
exports.refreshAuth = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const token = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(token.user);
    if (!user) {
      throw new Error();
    }
    await token.remove();
    const newTokens = await tokenService.generateAuthTokens(user);
    res.json({ ...newTokens });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.');
  }
});
