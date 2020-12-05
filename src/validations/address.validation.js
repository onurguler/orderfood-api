const { body, param } = require('express-validator');

const addressParam = param('address').isMongoId().withMessage('Please provide a valid id.');

const createAddress = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('text').trim().notEmpty().withMessage('Address text is required.'),
  body('directionsTo').optional({ nullable: true }).isString().withMessage('Directions to must be a string.'),
  body('isDeliveryAddress').default(false).isBoolean().withMessage('Is delivery address must be a boolean.'),
];

exports.createAddress = createAddress;

exports.updateAddress = createAddress;

exports.deleteAddress = addressParam;

exports.getAddress = addressParam;

exports.markAsDeliveryAddress = addressParam;
