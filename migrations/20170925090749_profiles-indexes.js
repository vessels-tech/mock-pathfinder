'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.table('profiles', t => {
    t.unique('name')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('profiles', t => {
    t.dropUnique('name')
  })
}
