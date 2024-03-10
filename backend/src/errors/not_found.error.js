const BaseError = require('./base.error');

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND');
    }
}

module.exports = NotFoundError;