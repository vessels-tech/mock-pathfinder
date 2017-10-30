'use strict'

const SoapActions = require('./actions')

const SendRequest = (args, cb) => {
  let method = Object.keys(args)[0]
  let params = args[method]

  SoapActions.process(method, params).asCallback(cb)
}

exports.service = {
  SIPIX: {
    SendRequest: {
      SendRequest
    }
  }
}
