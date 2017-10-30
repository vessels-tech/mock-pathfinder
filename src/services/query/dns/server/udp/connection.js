'use strict'

const EventEmitter = require('events').EventEmitter

class UdpConnection extends EventEmitter {
  constructor (socket, remote) {
    super()

    this._socket = socket
    this._remote = remote
  }

  send (data) {
    this._socket.send(data, 0, data.length, this._remote.port, this._remote.address)
  }

  getBaseSize () {
    return 512
  }
}

exports.create = (socket, remote) => {
  return new UdpConnection(socket, remote)
}
