const express = require('express');
const { body, param } = require('express-validator');
const borrowerController = require('../controllers/borrower.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post('/', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('name').notEmpty().withMessage('Name is required')
], authMiddleware, borrowerController.addBorrower);

router.put('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('name').notEmpty().withMessage('Name is required')
], authMiddleware, borrowerController.updateBorrower);

router.delete('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
], authMiddleware, borrowerController.deleteBorrower);

router.get('/all', authMiddleware, borrowerController.getAllBorrowers);

module.exports = router;
