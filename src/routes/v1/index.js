const express = require('express');
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const productsRoute = require('./products.route');
const cartRoute = require('./cart.route');
const addressesRoute = require('./addresses.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/products', productsRoute);
router.use('/cart', cartRoute);
router.use('/addresses', addressesRoute);

module.exports = router;
