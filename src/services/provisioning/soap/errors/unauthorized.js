'use strict'

const BaseError = require('./base')

class UnauthorizedError extends BaseError {
  constructor (message) {
    super(401, 'Unauthorized', message)
  }
}

module.exports = UnauthorizedError
