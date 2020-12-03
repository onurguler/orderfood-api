const express = require('express');
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const productsRoute = require('./products.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/products', productsRoute);

module.exports = router;
