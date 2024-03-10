const BaseError = require('./base.error');

class BorrowingAlreadyReturnedError extends BaseError {
    constructor(message) {
        super(message, 400, 'BORROWING_ALREADY_RETURNED');
    }
}

module.exports = BorrowingAlreadyReturnedError;