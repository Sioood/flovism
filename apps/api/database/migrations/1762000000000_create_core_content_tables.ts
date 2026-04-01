import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('languages', (table) => {
      table.string('code', 10).primary()
      table.string('locale', 8).notNullable()
      table.string('country', 4).notNullable()
      table.string('endonym', 64).notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('is_default').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('content_statuses', (table) => {
      table.string('code', 24).primary()
      table.string('label', 64).notNullable()
      table.smallint('position').notNullable()
      table.boolean('is_public').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE UNIQUE INDEX languages_single_default_idx ON languages (is_default) WHERE is_default = true')
  }

  async down() {
    this.schema.raw('DROP INDEX IF EXISTS languages_single_default_idx')
    this.schema.dropTable('content_statuses')
    this.schema.dropTable('languages')
  }
}
