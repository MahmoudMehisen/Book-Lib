const express = require('express');
const { body, param, query } = require('express-validator');
const bookController = require('../controllers/book.controller');
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post('/', [
    body('title').notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
    body('author').notEmpty().withMessage('Author cannot be empty').isString().withMessage('Author must be a string'),
    body('ISBN').notEmpty().withMessage('ISBN cannot be empty').isString().withMessage('ISBN must be a string'),
    body('quantity').notEmpty().withMessage('Quantity cannot be empty').isInt({ min: 0 }).withMessage('Quantity must be zero or a positive integer'),
    body('shelfLocation').notEmpty().withMessage('Shelf location cannot be empty').isString().withMessage('Shelf location must be a string'),
], authMiddleware, bookController.addBook);

router.put('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
    body('title').notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
    body('author').notEmpty().withMessage('Author cannot be empty').isString().withMessage('Author must be a string'),
    body('ISBN').notEmpty().withMessage('ISBN cannot be empty').isString().withMessage('ISBN must be a string'),
    body('quantity').notEmpty().withMessage('Quantity cannot be empty').isInt({ min: 0 }).withMessage('Quantity must be zero or a positive integer'),
    body('shelfLocation').notEmpty().withMessage('Shelf location cannot be empty').isString().withMessage('Shelf location must be a string'),
], authMiddleware, bookController.updateBook);

router.delete('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
], authMiddleware, bookController.deleteBook);

router.get('/all', authMiddleware, bookController.getAllBooks);

router.get('/search', [
    query('key').notEmpty().withMessage('Key cannot be empty').isString().isIn(['title', 'author', 'ISBN']).withMessage('Key must be one of: title, author, ISBN'),
    query('query').notEmpty().withMessage('Query cannot be empty').isString().withMessage('Query must be a string'),
], authMiddleware, bookController.searchBooks);

module.exports = router;
