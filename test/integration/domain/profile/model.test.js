'use strict'

const Test = require('tape')
const Uuid = require('uuid4')
const Model = require('../../../../src/domain/profile/model')

Test('Profile model', modelTest => {
  modelTest.test('create should', createTest => {
    createTest.test('create a new profile', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }

      Model.create(profile)
        .then(saved => {
          test.ok(saved.created)
          test.equal(saved.profileId, profile.profileId)
          test.equal(saved.name, profile.name)
          test.equal(saved.tier, profile.tier)
          test.end()
        })
    })

    createTest.end()
  })

  modelTest.test('getById should', getByIdTest => {
    getByIdTest.test('get profile by name', test => {
      const profileId = Uuid()
      const name = `PROFILE-${Uuid()}`
      const profile = { profileId, name, tier: 2 }

      Model.create(profile)
        .then(saved => {
          Model.getById(saved.profileId)
            .then(found => {
              test.notEqual(found, saved)
              test.equal(found.profileId, saved.profileId)
              test.equal(found.name, saved.name)
              test.equal(found.tier, saved.tier)
              test.deepEqual(found.created, saved.created)
              test.end()
            })
        })
    })

    getByIdTest.end()
  })

  modelTest.test('getByName should', getByNameTest => {
    getByNameTest.test('get profile by name', test => {
      const name = `PROFILE-${Uuid()}`
      const profile = { profileId: Uuid(), name, tier: 2 }

      Model.create(profile)
        .then(saved => {
          Model.getByName(saved.name)
            .then(found => {
              test.notEqual(found, saved)
              test.equal(found.profileId, saved.profileId)
              test.equal(found.name, saved.name)
              test.equal(found.tier, saved.tier)
              test.deepEqual(found.created, saved.created)
              test.end()
            })
        })
    })

    getByNameTest.end()
  })

  modelTest.end()
})
