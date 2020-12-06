const { body, param } = require('express-validator');

const addressParam = param('address').isInt({ gt: 0 }).withMessage('Please provide a valid id.');

const createAddress = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('address').trim().notEmpty().withMessage('Address is required.'),
  body('address2').optional({ nullable: true }).trim().isString().withMessage('Address is required.'),
  body('district').trim().notEmpty().withMessage('District is required.'),
  body('postalCode').trim().isPostalCode('any').notEmpty().withMessage('Please provide a valid postal code.'),
  body('phone').trim().isMobilePhone('any').withMessage('Please provide a valid mobile phone.'),
  body('directionsTo').optional({ nullable: true }).isString().withMessage('Directions to must be a string.'),
  body('markPreferredAddress').default(true).isBoolean().withMessage('Mark preferred address must be a boolean.'),
];

exports.createAddress = createAddress;

exports.updateAddress = [addressParam, createAddress];

exports.deleteAddress = addressParam;

exports.getAddress = addressParam;

exports.markAsPreferredAddress = addressParam;
