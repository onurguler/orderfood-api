const { body } = require('express-validator');
const { User } = require('../database');

exports.register = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ max: 96 })
    .withMessage('Name must be maximum 96 characters.'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ max: 32 })
    .withMessage('Username must be maximum 32 characters.')
    .custom(async (value) => {
      if (await User.isUsernameTaken(value)) {
        throw new Error('A user with that username already exists.');
      }
      return true;
    }),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email.')
    .custom(async (value) => {
      if (await User.isEmailTaken(value)) {
        throw new Error('A user with that email already exists.');
      }
      return true;
    })
    .normalizeEmail({ gmail_remove_dots: false }),

  body('password')
    .isLength({ min: 8 })
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase. At least one lower case. At least one special character.'
    )
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase. At least one lower case. At least one special character.'
    ),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords doesn't match.");
    }
    return true;
  }),
];

exports.login = [
  body('email').trim().isEmail().withMessage('Please include a valid email.').normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.refreshAuth = body('refreshToken', 'Please include a valid token.').isJWT();
