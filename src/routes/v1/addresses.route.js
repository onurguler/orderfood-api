const express = require('express');
const addressController = require('../../controllers/address.controller');
const loginRequired = require('../../middlewares/loginRequired');
const addressValidation = require('../../validations/address.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.post('/', loginRequired, [addressValidation.createAddress, validate], addressController.createAddress);
router.get('/', loginRequired, addressController.getMyAdresses);
router.get('/delivery', loginRequired, addressController.getMyDeliveryAddress);
router.get('/:address', loginRequired, [addressValidation.getAddress, validate], addressController.getAddress);
router.put(
  '/:address/mark-as-delivery',
  loginRequired,
  [addressValidation.markAsDeliveryAddress, validate],
  addressController.markAsDeliveryAddress
);
router.patch('/:address', loginRequired, [addressValidation.updateAddress, validate], addressController.updateAddress);
router.delete('/:address', loginRequired, [addressValidation.deleteAddress, validate], addressController.deleteAddress);

module.exports = router;
