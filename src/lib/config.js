const RC = require('rc')('MOPF', require('../../config/default.json'))

module.exports = {
  QUERY: RC.QUERY,
  PROVISIONING: RC.PROVISIONING,
  DATABASE_URI: RC.DATABASE_URI
}
