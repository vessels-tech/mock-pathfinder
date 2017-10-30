'use strict'

const Db = require('../../lib/db')

exports.create = (record) => {
  return Db.records.insert(record)
}

exports.getByProfileId = (profileId) => {
  return Db.records.query(builder => {
    return builder
      .where({ profileId })
      .orderBy('order', 'asc')
      .orderBy('preference', 'asc')
  })
}

exports.removeForProfileId = (profileId) => {
  return Db.records.destroy({ profileId })
}
