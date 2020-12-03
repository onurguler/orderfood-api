const { body, param } = require('express-validator');

const createProduct = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('price')
    .isCurrency({
      decimal_separator: '.',
      thousands_separator: '',
      allow_negatives: false,
      allow_space_after_digits: false,
      require_symbol: false,
    })
    .withMessage('Price must be a currency.'),
];

const getProduct = [param('product').isMongoId().withMessage('Please pass an valid id.')];

exports.createProduct = createProduct;
exports.updateProduct = [...getProduct, ...createProduct];
exports.getProduct = getProduct;
exports.deleteProduct = [...getProduct];
