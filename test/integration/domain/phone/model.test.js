'use strict'

const Test = require('tape')
const Uuid = require('uuid4')
const ProfileModel = require('../../../../src/domain/profile/model')
const PhoneModel = require('../../../../src/domain/phone/model')

Test('Phone model', modelTest => {
  modelTest.test('create should', createTest => {
    createTest.test('create a new phone', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const phone = { phoneId: Uuid(), number: '5558675309', countryCode: '1', profileId: profile.profileId, status: 'active' }

      ProfileModel.create(profile)
        .then(savedProfile => PhoneModel.create(phone))
        .then(savedPhone => {
          test.ok(savedPhone.created)
          test.equal(savedPhone.phoneId, phone.phoneId)
          test.equal(savedPhone.profileId, phone.profileId)
          test.end()
        })
    })

    createTest.end()
  })

  modelTest.test('getByNumber should', getByNumberTest => {
    getByNumberTest.test('retrieve a phone by the number', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const phone = { phoneId: Uuid(), number: '5558675308', countryCode: '1', profileId: profile.profileId, status: 'active' }

      ProfileModel.create(profile)
        .then(savedProfile => PhoneModel.create(phone))
        .then(savedPhone => {
          PhoneModel.getByNumber(phone.number, phone.countryCode)
            .then(foundPhone => {
              test.notEqual(foundPhone, savedPhone)
              test.equal(foundPhone.phoneId, phone.phoneId)
              test.equal(foundPhone.profileId, phone.profileId)
              test.equal(foundPhone.number, phone.number)
              test.equal(foundPhone.countryCode, phone.countryCode)
              test.equal(foundPhone.status, phone.status)
              test.ok(foundPhone.created)
              test.end()
            })
        })
    })

    getByNumberTest.end()
  })

  modelTest.test('removeById should', removeByIdTest => {
    removeByIdTest.test('remove a phone by id', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const phone = { phoneId: Uuid(), number: '5558675307', countryCode: '1', profileId: profile.profileId, status: 'active' }

      ProfileModel.create(profile)
        .then(savedProfile => PhoneModel.create(phone))
        .then(savedPhone => {
          PhoneModel.removeById(phone.phoneId)
            .then(removedPhone => {
              test.equal(removedPhone.phoneId, phone.phoneId)
              test.equal(removedPhone.profileId, phone.profileId)
              test.equal(removedPhone.number, phone.number)
              test.equal(removedPhone.countryCode, phone.countryCode)
              test.equal(removedPhone.status, phone.status)
              test.end()
            })
        })
    })

    removeByIdTest.end()
  })

  modelTest.test('getByProfileId should', getByProfileIdTest => {
    getByProfileIdTest.test('get all phones for a profile and order by created', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const phone = { phoneId: Uuid(), number: '5558675306', countryCode: '1', profileId: profile.profileId, status: 'active' }
      const phone2 = { phoneId: Uuid(), number: '5558675305', countryCode: '1', profileId: profile.profileId, status: 'active' }

      ProfileModel.create(profile)
        .then(savedProfile => PhoneModel.create(phone))
        .then(savedPhone => PhoneModel.create(phone2))
        .then(savedPhone2 => PhoneModel.getByProfileId(profile.profileId))
        .then(found => {
          test.equal(found.length, 2)
          test.equal(found[0].phoneId, phone.phoneId)
          test.equal(found[1].phoneId, phone2.phoneId)
          test.end()
        })
    })

    getByProfileIdTest.end()
  })

  modelTest.test('update should', updateTest => {
    updateTest.test('update phone record', test => {
      const profile = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const profile2 = { profileId: Uuid(), name: `PROFILE-${Uuid()}`, tier: 2 }
      const phone = { phoneId: Uuid(), number: '5558675304', countryCode: '1', profileId: profile.profileId, status: 'active' }

      ProfileModel.create(profile)
        .then(savedProfile => ProfileModel.create(profile2))
        .then(savedProfile2 => PhoneModel.create(phone))
        .then(savedPhone => {
          return PhoneModel.update(savedPhone.phoneId, { profileId: profile2.profileId, status: 'inactive' })
            .then(updated => {
              test.equal(updated.phoneId, savedPhone.phoneId)
              test.equal(updated.status, 'inactive')
              test.equal(updated.profileId, profile2.profileId)
              test.end()
            })
        })
    })

    updateTest.end()
  })

  modelTest.end()
})
