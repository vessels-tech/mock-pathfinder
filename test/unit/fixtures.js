'use strict'

const Packet = require('native-dns-packet')

exports.generateRequestId = () => {
  return Math.floor(Math.random() * 50000 + 1)
}

exports.createNaptrPacket = (address) => {
  let packet = new Packet()
  packet.header.id = exports.generateRequestId()
  packet.header.rd = 1
  packet.question.push({ name: address, type: Packet.consts.NAME_TO_QTYPE.NAPTR, class: 1 })
  return packet
}

exports.writePacketToBuffer = (packet) => {
  let tempBuffer = Buffer.alloc(4096)
  let length = Packet.write(tempBuffer, packet)

  let buffer = Buffer.alloc(length)
  tempBuffer.copy(buffer, 0, 0, length)
  return buffer
}

exports.writePacketToBufferWithLength = (packet) => {
  let prefixSize = 2
  let tempBuffer = Buffer.alloc(1024)
  let length = Packet.write(tempBuffer, packet)

  let buffer = Buffer.alloc(length + prefixSize)
  buffer.writeUInt16BE(length, 0)
  tempBuffer.copy(buffer, prefixSize, 0, length)
  return buffer
}

exports.appendToBuffer = (existing, data) => {
  return Buffer.concat([existing, data], existing.length + data.length)
}
