
const bookService = require('../services/book.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const DuplicateISBNError = require('../errors/duplicate_isbn.error');
const NotFoundError = require('../errors/not_found.error');

const addBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, ISBN, quantity, shelfLocation } = req.body;
    try {
        const book = await bookService.findByISBN(ISBN);
        if (book) {
            logger.error('Failed to add book: duplicated ISBN');
            return res.status(400).json({ message: 'Failed to add book: duplicated ISBN' });
        }

        const newBook = await bookService.addBook(title, author, ISBN, quantity, shelfLocation);
        logger.info('Book added successfully:', newBook);
        res.status(201).json(newBook);
    } catch (error) {
        if (error instanceof DuplicateISBNError) {
            logger.error('Failed to add book: duplicated ISBN ' + ISBN);
            return res.status(error.statusCode).json({ message: 'Failed to add book: duplicated ISBN' });
        }

        logger.error('Failed to add book:', error);
        res.status(500).json({ message: 'Failed to add book', error: error.message });
    }
};

const updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, ISBN, quantity, shelfLocation } = req.body;
    try {
        const book = await bookService.updateBook(id, title, author, ISBN, quantity, shelfLocation);
        logger.info('Book updated successfully:', book);
        res.json(book);
    } catch (error) {
        if (error instanceof DuplicateISBNError) {
            logger.error('Failed to update book: duplicated ISBN ' + ISBN);
            return res.status(error.statusCode).json({ message: 'Failed to update book: duplicated ISBN' });
        }

        if (error instanceof NotFoundError) {
            logger.error('Book not found with id:' + id);
            return res.status(error.statusCode).json({ message: 'Book not found' });
        }

        logger.error('Failed to update book:', error);
        res.status(500).json({ message: 'Failed to update book', error: error.message });
    }
};
const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await bookService.deleteBook(id);
        logger.info('Book deleted successfully');
        res.sendStatus(204);
    } catch (error) {
        if (error instanceof NotFoundError) {
            logger.error('Book not found with id:' + id);
            return res.status(error.statusCode).json({ message: 'Book not found' });
        }

        logger.error('Failed to delete book:', error);
        res.status(500).json({ message: 'Failed to delete book', error: error.message });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.json(books);
    } catch (error) {
        logger.error('Failed to fetch books:', error);
        res.status(500).json({ message: 'Failed to fetch books', error: error.message });
    }
};

const searchBooks = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { key, query } = req.query;

    try {
        const books = await bookService.searchBooks(key, query);
        logger.info('Books found:', books);
        res.json(books);
    } catch (error) {
        logger.error('Failed to search books:', error);
        res.status(500).json({ message: 'Failed to search books', error: error.message });
    }

};

module.exports = {
    addBook,
    updateBook,
    deleteBook,
    getAllBooks,
    searchBooks,
};