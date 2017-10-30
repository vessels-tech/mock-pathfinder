'use strict'

const Db = require('../../lib/db')

exports.create = (profile) => {
  return Db.profiles.insert(profile)
}

exports.getById = (profileId) => {
  return Db.profiles.findOne({ profileId })
}

exports.getByName = (name) => {
  return Db.profiles.findOne({ name })
}
