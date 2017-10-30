'use strict'

const BaseError = require('./base')

class ValueMissingError extends BaseError {
  constructor (message) {
    super(421, 'Value Missing', message)
  }
}

module.exports = ValueMissingError
