'use strict'

const Packet = require('native-dns-packet')

class Response extends Packet {
  constructor (connection) {
    super()

    this._connection = connection
  }

  send () {
    let buff = Buffer.alloc(this._connection.getBaseSize())
    let len = Packet.write(buff, this)
    this._connection.send(buff.slice(0, len))
  }

  static fromRequest (request, connection) {
    let response = new Response(connection)
    response.header.id = request.header.id
    response.header.qr = 1
    response.question = request.question
    return response
  }
}

module.exports = Response
