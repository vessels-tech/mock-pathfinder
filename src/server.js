'use strict'

const Logger = require('@mojaloop/central-services-shared').Logger
const Db = require('./lib/db')
const Config = require('./lib/config')
const Migrator = require('./lib/migrator')
const QueryService = require('./services/query')
const ProvisioningService = require('./services/provisioning')

const startServer = () => {
  let queryService = QueryService.create(Config.QUERY)
  let provisioningService = ProvisioningService.create(Config.PROVISIONING)

  return Migrator.migrate()
    .then(() => Db.connect(Config.DATABASE_URI))
    .then(() => queryService.start())
    .then(() => provisioningService.start())
    .then(() => Logger.info('mock-pathfinder server started'))
    .catch(err => {
      Logger.error('Fatal error thrown by mock-pathfinder server', err)
      cleanup()
      throw err
    })
}

const cleanup = () => {
  Db.disconnect()
}

module.exports = startServer()
