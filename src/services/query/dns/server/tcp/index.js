'use strict'

const Net = require('net')
const BaseServer = require('../base')
const TcpConnection = require('./connection')

class TcpServer extends BaseServer {
  constructor (opts) {
    super(opts)

    let self = this
    self.type = 'TCP'

    self._socket = Net.createServer()
    self._socket.on('connection', (conn) => {
      let tcpConnection = TcpConnection.create(conn)
      tcpConnection.on('message', (msg, remote) => {
        self.handleMessage(msg, tcpConnection)
      })
    })

    self._setupSocket()
  }

  listen (port, address) {
    this._socket.listen(port, address)
  }
}

exports.createServer = function (opts) {
  return new TcpServer(opts || {})
}
