'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('profiles', t => {
    t.uuid('profileId').primary()
    t.string('name', 1024).notNullable()
    t.integer('tier').notNullable()
    t.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('profiles')
}
