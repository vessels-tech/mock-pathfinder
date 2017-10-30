'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.table('records', t => {
    t.index('profileId')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('records', t => {
    t.dropIndex('profileId')
  })
}
