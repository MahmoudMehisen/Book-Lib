const BaseError = require('./base.error');

class DuplicateBorrowingError extends BaseError {
    constructor(message) {
        super(message, 400, 'DUPLICATE_BORROWING');
    }
}

module.exports = DuplicateBorrowingError;