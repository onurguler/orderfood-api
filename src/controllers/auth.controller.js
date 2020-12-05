const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { tokenTypes } = require('../config/tokens');
const { User, sequelize } = require('../database');
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
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.create({ name, username, email, password }, { transaction: t });
      const tokens = await tokenService.generateAuthTokens(user, { transaction: t });
      user.password = undefined;
      return { user, tokens };
    });
    res.status(httpStatus.CREATED).json(result);
  } catch (error) {
    throw new Error();
  }
});

/**
 * @route   /api/v1/auth/login
 * @method  POST
 * @desc    Login with email and password
 * @access  public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.authenticate(email, password);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Incorrect email or password.' });
  }
  const tokens = await tokenService.generateAuthTokens(user);
  user.password = undefined;
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

  const token = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.');
  }

  const user = await User.findByPk(token.userId);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.');
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      await token.destroy({ transaction: t });
      const newTokens = await tokenService.generateAuthTokens(user, { transaction: t });
      return newTokens;
    });
    res.json(result);
  } catch (error) {
    throw new Error();
  }
});
