const BaseError = require('./base.error');

class BookNotAvailableError extends BaseError {
    constructor(message) {
        super(message, 400, 'BOOK_NOT_AVAILABLE');
    }
}

module.exports = BookNotAvailableError;