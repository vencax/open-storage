const CONSTS = require('../src/consts')
const _ = require('underscore')

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable(CONSTS.TABLENAMES.FILES, (table) => {
      table.increments('id')
      table.string('filename', 64).notNullable()
      table.string('tags', 64).notNullable()
      table.enum('type', _.values(CONSTS.FILETYPES))
      table.timestamp('created').notNullable()
      table.timestamp('uploaded').notNullable().defaultTo(knex.fn.now())
      // table.string('group')  // valid for certain group only
    }),
    knex.schema.createTable(CONSTS.TABLENAMES.INCOMPLETES, (table) => {
      table.string('uid', 128).notNullable().primary()
      table.string('params', 512).notNullable()
      table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable(CONSTS.TABLENAMES.FILES),
    knex.schema.dropTable(CONSTS.TABLENAMES.INCOMPLETES)
  ])
}
