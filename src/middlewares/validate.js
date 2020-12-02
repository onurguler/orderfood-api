const { validationResult } = require('express-validator');
const httpStatus = require('http-status');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }
  next();
};
