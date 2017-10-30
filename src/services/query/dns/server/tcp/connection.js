'use strict'

const BitSyntax = require('bitsyntax')
const EventEmitter = require('events').EventEmitter

class TcpConnection extends EventEmitter {
  constructor (socket) {
    super()

    let self = this
    self._socket = socket
    self._builder = BitSyntax.builder('len:16/big-unsigned, message/binary')
    self._matcher = BitSyntax.matcher('len:16/big-unsigned, message:len/binary, rest/binary')

    let buffer = Buffer.alloc(0)

    self._socket.on('data', data => {
      buffer = self._appendToBuffer(buffer, data)
      while (true) {
        let parsed = self._matcher(buffer)
        if (!parsed) break

        self.emit('message', parsed.message)
        buffer = parsed.rest
      }
    })
    self._socket.on('close', () => self.emit('close'))
    self._socket.on('error', (err) => self.emit('error', err))
  }

  send (data) {
    let message = Buffer.isBuffer(data) ? data : Buffer.from(data)
    this._socket.write(this._builder({ len: message.length, message }))
  }

  getBaseSize () {
    return 4096
  }

  _appendToBuffer (existing, data) {
    return Buffer.concat([existing, data], existing.length + data.length)
  }
}

exports.create = (socket) => {
  return new TcpConnection(socket)
}
