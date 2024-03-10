const BaseError = require('./base.error');

class DuplicateISBNError extends BaseError {
    constructor(message) {
        super(message, 400, 'DUPLICATE_ISBN');
    }
}

module.exports = DuplicateISBNError;