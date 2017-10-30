'use strict'

const BaseError = require('./base')

class InvalidValueError extends BaseError {
  constructor (message) {
    super(420, 'Invalid Value', message)
  }
}

module.exports = InvalidValueError
