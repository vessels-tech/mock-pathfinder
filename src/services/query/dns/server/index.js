'use strict'

const TcpServer = require('./tcp')
const UdpServer = require('./udp')

exports.createServer = function (opts) {
  return exports.createUdpServer(opts)
}

exports.createTcpServer = function (opts) {
  return TcpServer.createServer(opts)
}

exports.createUdpServer = function (opts) {
  return UdpServer.createServer(opts)
}
