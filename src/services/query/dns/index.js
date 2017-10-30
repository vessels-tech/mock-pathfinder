'use strict'

const Consts = require('native-dns-packet').consts
const Server = require('./server')

exports.createServer = Server.createServer
exports.createTcpServer = Server.createTcpServer
exports.createUdpServer = Server.createUdpServer

let supportedTypes = ['NAPTR']

supportedTypes.forEach(function (name) {
  let recordType = Consts.nameToQtype(name)

  let f = function (opts) {
    let obj = {}
    opts = opts || {}
    obj.type = recordType
    obj.class = Consts.NAME_TO_QCLASS.IN
    Object.keys(opts).forEach(function (k) {
      if (opts.hasOwnProperty(k) && ['type', 'class'].indexOf(k) === -1) {
        obj[k] = opts[k]
      }
    })
    return obj
  }
  f.value = recordType

  exports[name] = f
})
