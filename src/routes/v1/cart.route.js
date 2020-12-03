const express = require('express');
const cartController = require('../../controllers/cart.controller');
const loginRequired = require('../../middlewares/loginRequired');
const cartValidation = require('../../validations/cart.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.put('/', loginRequired, [cartValidation.addToCart, validate], cartController.addToCart);
router.patch('/', loginRequired, [cartValidation.updateProductQuantity, validate], cartController.updateProductQuantity);
router.put('/remove', loginRequired, [cartValidation.removeFromCart, validate], cartController.removeFromCart);
router.delete('/', loginRequired, cartController.emptyCart);
router.get('/', loginRequired, cartController.getCart);

module.exports = router;
