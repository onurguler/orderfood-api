const express = require('express');
const productController = require('../../controllers/product.controller');
const loginRequired = require('../../middlewares/loginRequired');
const productValidation = require('../../validations/product.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.post('/', loginRequired, [productValidation.createProduct, validate], productController.createProduct);
router.get('/', productController.getProducts);

router.get('/:product', [productValidation.getProduct, validate], productController.getProduct);
router.patch('/:product', loginRequired, [productValidation.updateProduct, validate], productController.updateProduct);
router.delete('/:product', loginRequired, [productValidation.deleteProduct, validate], productController.deleteProduct);

module.exports = router;
