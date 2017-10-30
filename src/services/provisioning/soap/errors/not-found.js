'use strict'

const BaseError = require('./base')

class NotFoundError extends BaseError {
  constructor (message) {
    super(404, 'Not Found', message)
  }
}

module.exports = NotFoundError
