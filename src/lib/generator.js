'use strict'

const Uuid = require('uuid4')

exports.generateId = () => {
  return Uuid()
}
