'use strict'

const EventEmitter = require('events').EventEmitter
const DnsRequest = require('../request')
const DnsResponse = require('../response')

class BaseServer extends EventEmitter {
  constructor (opts) {
    super()
    this._bound = false
  }

  close () {
    let self = this

    if (self._bound) {
      self._bound = false
      self._socket.close(() => self.emit('close'))
    }
  }

  listen () {
    throw new Error('The listen method must be overridden!')
  }

  handleMessage (message, connection) {
    try {
      let request = DnsRequest.parse(message)
      let response = DnsResponse.fromRequest(request, connection)
      this.emit('request', request, response)
    } catch (err) {
      this.emit('error', err)
    }
  }

  _setupSocket () {
    let self = this

    self._socket.once('listening', () => {
      self._bound = true
      self.emit('listening')
    })
    self._socket.on('close', () => self.close())
    self._socket.on('error', (err) => self.emit('error', err))
  }
}

module.exports = BaseServer
