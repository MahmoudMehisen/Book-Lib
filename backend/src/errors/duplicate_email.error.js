const BaseError = require('./base.error');

class DuplicateEmailError extends BaseError {
    constructor(message) {
        super(message, 400, 'DUPLICATE_EMAIL');
    }
}

module.exports = DuplicateEmailError;