const express = require('express');
const authController = require('../../controllers/auth.controller');
const authValidation = require('../../validations/auth.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.post('/register', [authValidation.register, validate], authController.register);
router.post('/login', [authValidation.login, validate], authController.login);
router.post('/refresh', [authValidation.refreshAuth, validate], authController.refreshAuth);

module.exports = router;
