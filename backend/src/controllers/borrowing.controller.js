
const borrowingService = require('../services/borrowing.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const DuplicateBorrowingError = require('../errors/duplicate_borrowing.error');
const NotFoundError = require('../errors/not_found.error');
const BookNotAvailableError = require('../errors/book_not_available.error');
const BorrowingAlreadyReturnedError = require('../errors/borrowing_already_returned.error');

const createBorrowing = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, borrowerId, dueDate } = req.body;
    try {
        const borrowing = await borrowingService.createBorrowing(bookId, borrowerId, dueDate);
        logger.info('Borrowing added successfully:', borrowing);
        res.status(201).json(borrowing);
    } catch (error) {
        if (error instanceof DuplicateBorrowingError) {
            logger.error('Failed to create borrowing:' + error.message);
            return res.status(error.statusCode).json({ message: 'Failed to create borrowing', error: error.message });
        }

        if (error instanceof BookNotAvailableError) {
            logger.error('Failed to create borrowing:' + error.message);
            return res.status(error.statusCode).json({ message: 'Failed to create borrowing', error: error.message });
        }

        if (error instanceof NotFoundError) {
            logger.error('Failed to create borrowing:' + error.message);
            return res.status(error.statusCode).json({ message: 'Failed to create borrowing', error: error.message });
        }

        logger.error('Failed to create borrowing:', error);
        res.status(500).json({ message: 'Failed to create borrowing', error: error.message });
    }
};

const returnBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { borrowingId } = req.body;
    try {
        const borrowing = await borrowingService.returnBook(borrowingId);
        logger.info('Borrowing returned successfully:', borrowing);
        res.status(201).json(borrowing);
    } catch (error) {

        if (error instanceof NotFoundError) {
            logger.error('Failed to return borrowing:' + error.message);
            return res.status(error.statusCode).json({ message: 'Failed to return borrowing', error: error.message });
        }

        if (error instanceof BorrowingAlreadyReturnedError) {
            logger.error('Failed to return borrowing:' + error.message);
            return res.status(error.statusCode).json({ message: 'Failed to return borrowing', error: error.message });
        }

        logger.error('Failed to return borrowing:', error);
        res.status(500).json({ message: 'Failed to return borrowing', error: error.message });
    }

}

const getBorrowedBooksByBorrower = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { borrowerId } = req.params;

    try {
        const borrowedBooks = await borrowingService.getBorrowedBooksByBorrower(borrowerId);
        res.json(borrowedBooks);
    } catch (error) {
        logger.error('Failed to fetch borrowed books for borrower:', error);
        res.status(500).json({ message: 'Failed to fetch borrowed books for borrower', error: error.message });
    }

}

const getOverdueBooks = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const overdueBooks = await borrowingService.getOverdueBooks();
        res.json(overdueBooks);
    } catch (error) {
        logger.error('Failed to fetch overdue books:', error);
        res.status(500).json({ message: 'Failed to fetch overdue books', error: error.message });
    }

}


module.exports = {
    createBorrowing,
    returnBook,
    getBorrowedBooksByBorrower,
    getOverdueBooks
};