/**
 * @route   /api/v1/users/me
 * @method  GET
 * @desc    Get logged in user
 * @access  private
 */
exports.getMe = (req, res) => {
  res.json({ user: req.user });
};
