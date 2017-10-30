'use strict'

const Packet = require('native-dns-packet')

class Request extends Packet {
  parse (msg) {
    return Packet.parse(msg)
  }
}

module.exports = Request
