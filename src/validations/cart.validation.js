const { body } = require('express-validator');

const addToCart = [
  body('productId').isMongoId().withMessage('Please provide a valid id.'),
  body('quantity').default(1).isInt({ min: 1 }).withMessage('Quantity must be int.'),
];

exports.addToCart = addToCart;

exports.updateProductQuantity = addToCart;

exports.removeFromCart = [body('productId').isMongoId().withMessage('Please provide a valid id.')];
