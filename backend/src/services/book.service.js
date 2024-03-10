const DuplicateISBNError = require("../errors/duplicate_isbn.error");
const NotFoundError = require("../errors/not_found.error");
const { Book } = require("../models")
const { Op } = require('sequelize');

const bookService = {};

bookService.addBook = async (title, author, ISBN, quantity, shelfLocation) => {
    try {
        const book = await Book.create({
            title,
            author,
            ISBN,
            quantity,
            shelfLocation,
        });
        return book;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new DuplicateISBNError("ISBN is already in use");
        }
        throw error;
    }
};

bookService.findByISBN = async (ISBN) => {
    const book = await Book.findOne({ where: { ISBN } });
    return book;
}

bookService.updateBook = async (id, title, author, ISBN, quantity, shelfLocation) => {
    try {
        const book = await Book.findByPk(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }
        book.title = title;
        book.author = author;
        book.ISBN = ISBN;
        book.quantity = quantity;
        book.shelfLocation = shelfLocation;
        await book.save();
        return book;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new DuplicateISBNError("ISBN is already in use");
        }
        throw error;
    }
};

bookService.deleteBook = async (id) => {
    try {
        const book = await Book.findByPk(id);
        if (!book) {
            throw new NotFoundError('Book not found');
        }
        await book.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};

bookService.getAllBooks = async () => {
    try {
        const books = await Book.findAll();
        return books;
    } catch (error) {
        throw error;
    }
};

bookService.searchBooks = async (key, query) => {
    let whereClause = {};
    if (key === 'title') {
        whereClause = { title: { [Op.like]: `${query}%` } };
    } else if (key === 'author') {
        whereClause = { author: { [Op.like]: `${query}%` } };
    } else if (key === 'ISBN') {
        whereClause = { ISBN: { [Op.like]: `${query}%` } };
    }

    const books = await Book.findAll({ where: whereClause });
    return books;
};

module.exports = bookService;

