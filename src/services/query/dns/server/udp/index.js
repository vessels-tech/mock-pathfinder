'use strict'

const Dgram = require('dgram')
const BaseServer = require('../base')
const UdpConnection = require('./connection')

class UdpServer extends BaseServer {
  constructor (opts) {
    super(opts)

    let self = this
    self.type = 'UDP'

    self._socket = Dgram.createSocket(opts.dgramType || 'udp4')
    self._socket.on('message', (message, remote) => {
      self.handleMessage(message, UdpConnection.create(self._socket, remote))
    })

    this._setupSocket()
  }

  listen (port, address) {
    this._socket.bind(port, address)
  }
}

exports.createServer = function (opts) {
  return new UdpServer(opts || {})
}
