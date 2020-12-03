const express = require('express');
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);

module.exports = router;
