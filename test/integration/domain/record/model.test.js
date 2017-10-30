'use strict'

const Test = require('tape')
const Uuid = require('uuid4')
const ProfileModel = require('../../../../src/domain/profile/model')
const RecordModel = require('../../../../src/domain/record/model')

Test('Record model', modelTest => {
  modelTest.test('create should', createTest => {
    createTest.test('create a new record', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const record = {
        recordId: Uuid(),
        profileId: profile.profileId,
        order: 1,
        preference: 10,
        domainName: 'e164enum.net',
        ttl: 900,
        flags: 'u',
        service: 'E2U+mm',
        regexp: '^.*$',
        uri: 'mm:001.505@test.org',
        replacement: '.'
      }

      ProfileModel.create(profile)
        .then(savedProfile => RecordModel.create(record))
        .then(savedRecord => {
          test.ok(savedRecord.created)
          test.equal(savedRecord.recordId, record.recordId)
          test.equal(savedRecord.profileId, record.profileId)
          test.end()
        })
    })

    createTest.end()
  })

  modelTest.test('getByProfileId should', getByProfileIdTest => {
    getByProfileIdTest.test('return records for profile ordered by order then preference', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const record1 = {
        recordId: Uuid(),
        profileId: profile.profileId,
        order: 15,
        preference: 1,
        domainName: 'e164enum.net',
        ttl: 900,
        flags: 'u',
        service: 'E2U+mm',
        regexp: '^.*$',
        uri: 'mm:001.505@test.org',
        replacement: '.'
      }

      const record2 = {
        recordId: Uuid(),
        profileId: profile.profileId,
        order: 10,
        preference: 2,
        domainName: 'e164enum.net',
        ttl: 900,
        flags: 'u',
        service: 'E2U+mm',
        regexp: '^.*$',
        uri: 'mm:001.506@test.org',
        replacement: '.'
      }

      const record3 = {
        recordId: Uuid(),
        profileId: profile.profileId,
        order: 10,
        preference: 1,
        domainName: 'e164enum.net',
        ttl: 900,
        flags: 'u',
        service: 'E2U+mm',
        regexp: '^.*$',
        uri: 'mm:001.507@test.org',
        replacement: '.'
      }

      ProfileModel.create(profile)
        .then(() => RecordModel.create(record1))
        .then(() => RecordModel.create(record2))
        .then(() => RecordModel.create(record3))
        .then(() => RecordModel.getByProfileId(profile.profileId))
        .then(found => {
          test.equal(found.length, 3)
          test.equal(found[0].recordId, record3.recordId)
          test.equal(found[1].recordId, record2.recordId)
          test.equal(found[2].recordId, record1.recordId)
          test.end()
        })
    })

    getByProfileIdTest.end()
  })

  modelTest.test('removeForProfileId should', removeForProfileIdTest => {
    removeForProfileIdTest.test('remove records for profile', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const record1 = {
        recordId: Uuid(),
        profileId: profile.profileId,
        order: 15,
        preference: 1,
        domainName: 'e164enum.net',
        ttl: 900,
        flags: 'u',
        service: 'E2U+mm',
        regexp: '^.*$',
        uri: 'mm:001.505@test.org',
        replacement: '.'
      }

      const record2 = {
        recordId: Uuid(),
        profileId: profile.profileId,
        order: 10,
        preference: 2,
        domainName: 'e164enum.net',
        ttl: 900,
        flags: 'u',
        service: 'E2U+mm',
        regexp: '^.*$',
        uri: 'mm:001.506@test.org',
        replacement: '.'
      }

      ProfileModel.create(profile)
        .then(() => RecordModel.create(record1))
        .then(() => RecordModel.create(record2))
        .then(() => RecordModel.getByProfileId(profile.profileId))
        .then(found => {
          test.equal(found.length, 2)
          return RecordModel.removeForProfileId(profile.profileId)
            .then(() => RecordModel.getByProfileId(profile.profileId))
            .then(found2 => {
              test.equal(found2.length, 0)
              test.end()
            })
        })
    })

    removeForProfileIdTest.end()
  })

  modelTest.end()
})
