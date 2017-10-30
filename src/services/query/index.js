'use strict'

const P = require('bluebird')
const EventEmitter = require('events')
const Dns = require('./dns')
const Logger = require('@mojaloop/central-services-shared').Logger
const PhoneFormat = require('../../lib/phone')
const PhoneService = require('../../domain/phone')
const RecordService = require('../../domain/record')

class QueryService extends EventEmitter {
  constructor (settings) {
    super()

    this._port = settings.PORT
    this._defaultRecord = settings.DEFAULT_RECORD

    this._bound = false

    this._dnsServer = Dns.createServer()
    this._dnsServer.on('close', this._onServerClose.bind(this))
    this._dnsServer.on('error', this._onServerError.bind(this))
    this._dnsServer.on('request', this._onServerRequest.bind(this))
  }

  start () {
    return new P((resolve, reject) => {
      this._dnsServer.once('listening', () => {
        Logger.info('Query service listening over %s on port %s', this._dnsServer.type, this._port)
        this._bound = true
        resolve()
      })

      this._dnsServer.listen(this._port)
    })
  }

  _onServerClose () {
    Logger.info('Query service closed')
  }

  _onServerError (err) {
    Logger.error('Query service error', err)
  }

  _onServerRequest (request, response) {
    Logger.info('*** DNS Request ***')
    Logger.info(request)

    if (request.question[0].type === Dns.NAPTR.value) {
      let name = request.question[0].name

      let parsedPhone = PhoneFormat.enumDomainToParsedPhone(name)
      if (parsedPhone.isValidNumber) {
        PhoneService.getByNumber(parsedPhone.nationalNumber, parsedPhone.countryCode)
          .then(found => {
            if (found && found.status.toLowerCase() === 'active') {
              RecordService.getByProfileId(found.profileId)
                .then(records => {
                  records.forEach(r => {
                    response.answer.push(Dns.NAPTR({
                      name,
                      order: r.order,
                      preference: r.preference,
                      flags: r.flags,
                      service: r.service,
                      regexp: `!${r.regexp}!${r.uri}!`,
                      replacement: r.replacement === '.' ? '' : r.replacement,
                      ttl: r.ttl
                    }))
                  })
                  this._sendResponseWithDefault(name, response)
                })
            } else {
              this._sendResponseWithDefault(name, response)
            }
          })
      } else {
        this._sendResponseWithDefault(name, response)
      }
    } else {
      Logger.error('Unsupported record type: %s', request.question[0].type)
      response.send()
    }
  }

  _sendResponseWithDefault (name, response) {
    let record = Object.assign({}, this._defaultRecord)
    record.name = name

    response.header.rcode = 0
    response.answer.push(Dns.NAPTR(record))
    response.send()
  }
}

exports.create = (settings) => {
  return new QueryService(settings)
}
