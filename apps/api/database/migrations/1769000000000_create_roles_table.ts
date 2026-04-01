import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().notNullable()
      table.string('code', 32).notNullable().unique()
      table.string('label', 100).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.defer(async (db) => {
      const now = db.raw('CURRENT_TIMESTAMP')
      await db.table(this.tableName).insert([
        { id: 'role_admin', code: 'ADMIN', label: 'Administrator', created_at: now },
        { id: 'role_user', code: 'USER', label: 'User', created_at: now },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
