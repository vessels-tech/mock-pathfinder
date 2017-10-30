'use strict'

const Fs = require('fs')
const Http = require('http')
const Soap = require('soap')
const EventEmitter = require('events').EventEmitter
const Logger = require('@mojaloop/central-services-shared').Logger
const Service = require('./service')

class SoapServer extends EventEmitter {
  constructor (settings) {
    super()

    this._path = settings.PATH
    this._wsdlFile = settings.WSDL_FILE

    this._bound = false
    this._soapServer = null

    this._httpServer = Http.createServer((request, response) => {
      response.end('404: Not Found: ' + request.url)
    })
  }

  listen (port) {
    this._httpServer.once('listening', () => {
      let wsdl = Fs.readFileSync(this._wsdlFile, 'utf8')

      this._soapServer = Soap.listen(this._httpServer, this._path, Service.service, wsdl)
      this._soapServer.log = (type, data) => {
        Logger.info(`SOAP ${type} message: ${data}`)
      }

      this._bound = true

      this.emit('listening')
    })

    this._httpServer.listen(port)
  }
}

exports.create = (settings) => {
  return new SoapServer(settings)
}
