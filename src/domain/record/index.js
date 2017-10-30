'use strict'

const Model = require('./model')
const Generator = require('../../lib/generator')

exports.create = (payload) => {
  payload.recordId = Generator.generateId()
  return Model.create(payload)
}

exports.getByProfileId = (profileId) => {
  return Model.getByProfileId(profileId)
}

exports.removeForProfileId = (profileId) => {
  return Model.removeForProfileId(profileId)
}
