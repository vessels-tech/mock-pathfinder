'use strict'

class BaseError extends Error {
  constructor (code, name, message) {
    super(message)
    this.code = code
    this.name = name

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = BaseError
