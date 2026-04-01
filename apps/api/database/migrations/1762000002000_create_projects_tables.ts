import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('projects', (table) => {
      table.string('id').primary()
      table.string('project_number', 16).notNullable().unique()
      table.integer('project_year').notNullable().index()
      table.string('status_code', 24).notNullable().references('code').inTable('content_statuses')
      table.timestamp('scheduled_at', { useTz: true }).nullable()
      table.timestamp('published_at', { useTz: true }).nullable()
      table.string('created_by').references('id').inTable('users').onDelete('SET NULL')
      table.string('updated_by').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('project_translations', (table) => {
      table.string('id').primary()
      table.string('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')
      table.string('language_code', 10).notNullable().references('code').inTable('languages').onDelete('CASCADE')
      table.string('slug', 190).notNullable()
      table.string('name', 190).notNullable()
      table.text('description').notNullable()
      table.string('client_name', 190).nullable()
      table.string('credit', 190).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.unique(['project_id', 'language_code'])
      table.unique(['language_code', 'slug'])
    })

    this.schema.createTable('project_categories', (table) => {
      table.string('id').primary()
      table.string('key', 64).notNullable().unique()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.createTable('project_category_project', (table) => {
      table.string('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')
      table.string('project_category_id').notNullable().references('id').inTable('project_categories').onDelete('CASCADE')
      table.primary(['project_id', 'project_category_id'])
    })

    this.schema.createTable('project_images', (table) => {
      table.string('id').primary()
      table.string('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE')
      table.string('upload_id').notNullable().references('id').inTable('uploads').onDelete('RESTRICT')
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.unique(['project_id', 'upload_id'])
      table.index(['project_id', 'sort_order'])
    })

    this.schema.createTable('project_image_translations', (table) => {
      table.string('id').primary()
      table.string('project_image_id').notNullable().references('id').inTable('project_images').onDelete('CASCADE')
      table.string('language_code', 10).notNullable().references('code').inTable('languages').onDelete('CASCADE')
      table.string('alt', 190).notNullable()
      table.unique(['project_image_id', 'language_code'])
    })
  }

  async down() {
    this.schema.dropTable('project_image_translations')
    this.schema.dropTable('project_images')
    this.schema.dropTable('project_category_project')
    this.schema.dropTable('project_categories')
    this.schema.dropTable('project_translations')
    this.schema.dropTable('projects')
  }
}
