const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { User } = require('../database');
const ApiError = require('../utils/ApiError');

/**
 * @route   /api/v1/users/me
 * @method  GET
 * @desc    Get logged in user
 * @access  private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
  }
  res.json({ user });
});
