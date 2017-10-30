'use strict'

const BaseError = require('./base')

class NotImplementedError extends BaseError {
  constructor (message) {
    super(501, 'Not Implemented', message)
  }
}

module.exports = NotImplementedError
