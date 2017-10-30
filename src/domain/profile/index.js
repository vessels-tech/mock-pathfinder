'use strict'

const P = require('bluebird')
const Model = require('./model')
const Generator = require('../../lib/generator')
const RecordService = require('../record')

exports.create = (name, tier, records) => {
  const profileId = Generator.generateId()

  return Model.create({ profileId, name, tier })
    .then(created => {
      records.forEach(r => {
        r.profileId = profileId
      })

      return P.all(records.map(r => RecordService.create(r))).return(created)
    })
}

exports.update = (profileId, records) => {
  return Model.getById(profileId)
    .then(profile => {
      return RecordService.removeForProfileId(profileId)
        .then(removed => {
          records.forEach(r => {
            r.profileId = profileId
          })

          return P.all(records.map(r => RecordService.create(r))).return(profile)
        })
    })
}

exports.getById = (profileId) => {
  return Model.getById(profileId)
}

exports.getByName = (name) => {
  return Model.getByName(name)
}
