const { Borrowings, Book, Borrower } = require('../models');
const { sequelize } = require('../config/postgres.config');
const { Op } = require('sequelize');
const BookNotAvailableError = require('../errors/book_not_available.error');
const DuplicateBorrowingError = require('../errors/duplicate_borrowing.error');
const NotFoundError = require('../errors/not_found.error');
const BorrowingAlreadyReturnedError = require('../errors/borrowing_already_returned.error');

const borrowingService = {};

borrowingService.createBorrowing = async (bookId, borrowerId, dueDate) => {
    let transaction;

    try {
        // Start a transaction
        transaction = await sequelize.transaction();

        // Find the book by ID and lock it to prevent concurrent updates
        const book = await Book.findByPk(bookId, { transaction, lock: true });

        if (!book) {
            throw new NotFoundError('Book not found');
        }

        const borrower = await Borrower.findByPk(borrowerId);

        if (!borrower) {
            throw new NotFoundError('Borrower not found');
        }

        // Check if the book is available for borrowing
        if (book.quantity === 0) {
            throw new BookNotAvailableError('Book is not available for borrowing');
        }

        // Decrement the quantity of the book
        book.quantity -= 1;
        await book.save({ transaction });

        // Create the borrowing record
        const borrowing = await Borrowings.create({
            bookId,
            borrowerId,
            dueDate
        }, { transaction });

        // Commit the transaction
        await transaction.commit();

        return borrowing;
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) {
            await transaction.rollback();
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new DuplicateBorrowingError("Borrower is already has borrowed this book");
        }

        throw error;
    }
};

borrowingService.returnBook = async (borrowingId) => {
    let transaction;

    try {
        // Start a transaction
        transaction = await sequelize.transaction();

        // Find the borrowing record by ID and lock it to prevent concurrent updates
        const borrowing = await Borrowings.findByPk(borrowingId, { transaction, lock: true });

        // Check if the borrowing record exists
        if (!borrowing) {
            throw new NotFoundError('Borrowing not found');
        }

        if (borrowing.returnedAt) {
            throw new BorrowingAlreadyReturnedError('Borrowing already returned');
        }
        // Update the returnedAt field
        borrowing.returnedAt = new Date();
        await borrowing.save({ transaction });

        // Find the book associated with the borrowing record
        const book = await Book.findByPk(borrowing.bookId, { transaction });

        // Increment the quantity of the book
        book.quantity += 1;
        await book.save({ transaction });

        // Commit the transaction
        await transaction.commit();

        return borrowing;
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) {
            await transaction.rollback();
        }
        throw error;
    }
};

borrowingService.getBorrowedBooksByBorrower = async (borrowerId) => {
    try {
        const borrowedBooks = await Borrowings.findAll({
            where: {
                borrowerId,
                returnedAt: null
            },
            include: {
                model: Book,
                as: 'book'
            }
        });

        return borrowedBooks;
    } catch (error) {
        throw error;
    }
};


borrowingService.getOverdueBooks = async () => {
    try {
        const overdueBooks = await Borrowings.findAll({
            where: {
                dueDate: {
                    [Op.lt]: new Date()
                },
                returnedAt: null
            },
            include: {
                model: Book,
                as: 'book'
            }
        });

        return overdueBooks;
    } catch (error) {
        throw error;
    }
};
module.exports = borrowingService;

