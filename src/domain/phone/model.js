'use strict'

const Db = require('../../lib/db')

exports.create = (phone) => {
  return Db.phones.insert(phone)
}

exports.update = (phoneId, fields) => {
  return Db.phones.update({ phoneId }, fields)
}

exports.removeById = (phoneId) => {
  return Db.phones.destroy({ phoneId })
}

exports.getByNumber = (number, countryCode) => {
  return Db.phones.findOne({ number, countryCode })
}

exports.getByProfileId = (profileId) => {
  return Db.phones.find({ profileId }, { order: 'created asc' })
}
