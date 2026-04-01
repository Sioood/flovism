import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('uploads', (table) => {
      table.string('id').primary()
      table.string('disk', 40).notNullable()
      table.string('key', 2048).notNullable()
      table.string('original_name', 255).notNullable()
      table.string('extension', 16).nullable()
      table.string('mime_type', 128).notNullable()
      table.bigInteger('size').notNullable()
      table.string('checksum', 64).nullable()
      table.string('visibility', 16).notNullable().defaultTo('private')
      table.jsonb('file').nullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.string('uploaded_by').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })

    this.schema.alterTable('uploads', (table) => {
      table.unique(['disk', 'key'])
      table.index(['mime_type'])
      table.index(['uploaded_by'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable('uploads')
  }
}
