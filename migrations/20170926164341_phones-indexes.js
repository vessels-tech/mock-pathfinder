'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.table('phones', t => {
    t.index('profileId')
    t.unique(['number', 'countryCode'])
    t.index(['number', 'countryCode', 'status'])
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('phones', t => {
    t.dropIndex('profileId')
    t.dropUnique(['number', 'countryCode'])
    t.dropIndex(['number', 'countryCode', 'status'])
  })
}
