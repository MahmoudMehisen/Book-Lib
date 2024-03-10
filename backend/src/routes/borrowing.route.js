const express = require('express');
const { body, param } = require('express-validator');
const borrowingController = require('../controllers/borrowing.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const rateLimitMiddleware = require("../middlewares/rate_limit.middleware")

router.post('/create-borrowing', [
    body('bookId').notEmpty().isInt().withMessage('Book ID must be a non-empty integer'),
    body('borrowerId').notEmpty().isInt().withMessage('Borrower ID must be a non-empty integer'),
    body('dueDate').notEmpty().isISO8601().withMessage('Due date must be a non-empty ISO 8601 date/time string')
        .custom((value, { req }) => {
            const dueDate = new Date(value);
            if (dueDate <= new Date()) {
                throw new Error('Due date must be greater than current date and time');
            }
            return true;
        })

], rateLimitMiddleware, authMiddleware, borrowingController.createBorrowing);


router.post('/return-book', [
    body('borrowingId').notEmpty().isInt().withMessage('Borrowing ID must be a non-empty integer'),
], rateLimitMiddleware, authMiddleware, borrowingController.returnBook);


router.get('/borrowed-books-by-borrower/:borrowerId', [
    param('borrowerId').notEmpty().isInt().withMessage('Borrower ID must be a non-empty integer'),
], authMiddleware, borrowingController.getBorrowedBooksByBorrower);


router.get('/overdue-books', [
], authMiddleware, borrowingController.getOverdueBooks);

module.exports = router;
