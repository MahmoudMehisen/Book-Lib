const express = require('express');
const router = express.Router();
const bookRoutes = require('./book.route');
const authRoutes = require('./auth.route');
const borrowerRoutes = require('./borrower.route');
const borrowingRoutes = require('./borrowing.route');

router.use('/auth', authRoutes);
router.use('/book', bookRoutes);
router.use('/borrower', borrowerRoutes);
router.use('/borrowing', borrowingRoutes);

module.exports = router;