const express = require('express');
const userController = require('../../controllers/user.controller');
const loginRequired = require('../../middlewares/loginRequired');

const router = express.Router();

router.get('/me', loginRequired, userController.getMe);

module.exports = router;
