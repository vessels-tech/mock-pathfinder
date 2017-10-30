'use strict'

const InvalidValueError = require('./invalid-value')

class InvalidTransactionIdError extends InvalidValueError {
}

module.exports = InvalidTransactionIdError
