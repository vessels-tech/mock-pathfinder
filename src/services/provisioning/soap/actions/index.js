'use strict'

const P = require('bluebird')
const QueryPhone = require('./query-phone')
const ChangePhone = require('./change-phone')
const ActivatePhone = require('./activate-phone')
const DeactivatePhone = require('./deactivate-phone')
const FindProfile = require('./find-profile')
const CreateProfile = require('./create-profile')
const UpdateProfile = require('./update-profile')

exports.process = (method, params) => {
  switch (method) {
    case 'DefineDNSProfile':
      return CreateProfile.execute(params)
    case 'UpdateDNSProfile':
      return UpdateProfile.execute(params)
    case 'QueryDNSProfile':
      return FindProfile.execute(params)
    case 'QueryTN':
      return QueryPhone.execute(params)
    case 'Activate':
      return ActivatePhone.execute(params)
    case 'Deactivate':
      return DeactivatePhone.execute(params)
    case 'ChangeTN':
      return ChangePhone.execute(params)
    default:
      return P.resolve()
  }
}
