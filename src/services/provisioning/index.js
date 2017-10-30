'use strict'

const P = require('bluebird')
const Soap = require('./soap')
const Logger = require('@mojaloop/central-services-shared').Logger

class ProvisioningService {
  constructor (settings) {
    this._port = settings.PORT

    this._bound = false
    this._soapServer = Soap.createServer(settings)
  }

  start () {
    return new P((resolve, reject) => {
      this._soapServer.once('listening', () => {
        Logger.info('Provisioning service listening on port %s', this._port)
        this._bound = true
        resolve()
      })

      this._soapServer.listen(this._port)
    })
  }
}

exports.create = (settings) => {
  return new ProvisioningService(settings)
}
