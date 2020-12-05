const { body } = require('express-validator');

const bodyProductId = body('productId')
  .isInt({ allow_leading_zeroes: false, gt: 0 })
  .withMessage('Please provide a valid id.');

const addToCart = [
  bodyProductId,
  body('quantity').default(1).isInt({ allow_leading_zeroes: false, gt: 0 }).withMessage('Quantity must be int.'),
];

exports.addToCart = addToCart;

exports.updateProductQuantity = addToCart;

exports.removeFromCart = bodyProductId;
