'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('phones', t => {
    t.uuid('phoneId').primary()
    t.uuid('profileId').notNullable()
    t.foreign('profileId').references('profiles.profileId')
    t.string('number', 14).notNullable()
    t.string('countryCode', 3).notNullable()
    t.string('status', 10).notNullable()
    t.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('phones')
}
