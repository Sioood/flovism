import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('fonts', (table) => {
      table.string('id').primary()
      table.integer('year').notNullable().index()
      table.string('status_code', 24).notNullable().references('code').inTable('content_statuses')
      table.string('version', 16).notNullable().defaultTo('1.000')
      table.string('preview_color', 7).notNullable().defaultTo('#000000')
      table.boolean('is_variable_global').notNullable().defaultTo(false)
      table.timestamp('scheduled_at', { useTz: true }).nullable()
      table.timestamp('published_at', { useTz: true }).nullable()
      table.string('created_by').references('id').inTable('users').onDelete('SET NULL')
      table.string('updated_by').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('font_translations', (table) => {
      table.string('id').primary()
      table.string('font_id').notNullable().references('id').inTable('fonts').onDelete('CASCADE')
      table.string('language_code', 10).notNullable().references('code').inTable('languages').onDelete('CASCADE')
      table.string('slug', 190).notNullable()
      table.string('name', 190).notNullable()
      table.text('description').notNullable()
      table.string('credit', 190).nullable()
      table.unique(['font_id', 'language_code'])
      table.unique(['language_code', 'slug'])
    })

    this.schema.createTable('font_filters', (table) => {
      table.string('id').primary()
      table.string('key', 64).notNullable().unique()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.createTable('font_filter_font', (table) => {
      table.string('font_id').notNullable().references('id').inTable('fonts').onDelete('CASCADE')
      table.string('font_filter_id').notNullable().references('id').inTable('font_filters').onDelete('CASCADE')
      table.primary(['font_id', 'font_filter_id'])
    })

    this.schema.createTable('font_families', (table) => {
      table.string('id').primary()
      table.string('font_id').notNullable().references('id').inTable('fonts').onDelete('CASCADE')
      table.string('internal_name', 190).notNullable()
      table.decimal('price', 12, 2).nullable()
      table.boolean('can_trial').notNullable().defaultTo(false)
      table.integer('sort_order').notNullable().defaultTo(0)
      table.unique(['font_id', 'internal_name'])
    })

    this.schema.createTable('font_family_translations', (table) => {
      table.string('id').primary()
      table.string('family_id').notNullable().references('id').inTable('font_families').onDelete('CASCADE')
      table.string('language_code', 10).notNullable().references('code').inTable('languages').onDelete('CASCADE')
      table.string('display_name', 190).notNullable()
      table.unique(['family_id', 'language_code'])
    })

    this.schema.createTable('font_styles', (table) => {
      table.string('id').primary()
      table.string('font_id').notNullable().references('id').inTable('fonts').onDelete('CASCADE')
      table.string('family_id').nullable().references('id').inTable('font_families').onDelete('SET NULL')
      table.string('internal_name', 190).notNullable()
      table.decimal('price', 12, 2).nullable()
      table.boolean('can_trial').notNullable().defaultTo(false)
      table.boolean('is_variable').notNullable().defaultTo(false)
      table.integer('sort_order').notNullable().defaultTo(0)
      table.unique(['font_id', 'internal_name'])
    })

    this.schema.createTable('font_style_translations', (table) => {
      table.string('id').primary()
      table.string('style_id').notNullable().references('id').inTable('font_styles').onDelete('CASCADE')
      table.string('language_code', 10).notNullable().references('code').inTable('languages').onDelete('CASCADE')
      table.string('display_name', 190).notNullable()
      table.unique(['style_id', 'language_code'])
    })

    this.schema.createTable('font_formats', (table) => {
      table.string('id').primary()
      table.string('key', 32).notNullable().unique()
    })

    this.schema.createTable('font_style_format_files', (table) => {
      table.string('id').primary()
      table.string('style_id').notNullable().references('id').inTable('font_styles').onDelete('CASCADE')
      table.string('format_id').notNullable().references('id').inTable('font_formats').onDelete('RESTRICT')
      table.string('upload_id').notNullable().references('id').inTable('uploads').onDelete('RESTRICT')
      table.unique(['style_id', 'format_id'])
    })

    this.schema.createTable('font_supported_languages', (table) => {
      table.string('font_id').notNullable().references('id').inTable('fonts').onDelete('CASCADE')
      table.string('language_code', 10).notNullable().references('code').inTable('languages').onDelete('CASCADE')
      table.primary(['font_id', 'language_code'])
    })

    this.schema.createTable('font_pricing_plans', (table) => {
      table.string('id').primary()
      table.string('font_id').notNullable().references('id').inTable('fonts').onDelete('CASCADE')
      table.string('plan_type', 32).notNullable()
      table.string('license_key', 64).notNullable()
      table.string('currency', 3).notNullable().defaultTo('EUR')
      table.decimal('amount', 12, 2).notNullable()
      table.boolean('is_from_price').notNullable().defaultTo(false)
      table.unique(['font_id', 'plan_type', 'license_key', 'currency'])
    })

    this.schema.createTable('font_metrics', (table) => {
      table.string('font_id').primary().references('id').inTable('fonts').onDelete('CASCADE')
      table.smallint('serif_sans').notNullable().defaultTo(0)
      table.smallint('boring_fun').notNullable().defaultTo(0)
      table.smallint('script_geometric').notNullable().defaultTo(0)
      table.smallint('readable_illegible').notNullable().defaultTo(0)
      table.smallint('display_text').notNullable().defaultTo(0)
      table.smallint('style_count_score').notNullable().defaultTo(0)
    })

    this.schema.raw('ALTER TABLE font_metrics ADD CONSTRAINT font_metrics_serif_sans_chk CHECK (serif_sans BETWEEN 0 AND 100)')
    this.schema.raw('ALTER TABLE font_metrics ADD CONSTRAINT font_metrics_boring_fun_chk CHECK (boring_fun BETWEEN 0 AND 100)')
    this.schema.raw('ALTER TABLE font_metrics ADD CONSTRAINT font_metrics_script_geometric_chk CHECK (script_geometric BETWEEN 0 AND 100)')
    this.schema.raw('ALTER TABLE font_metrics ADD CONSTRAINT font_metrics_readable_illegible_chk CHECK (readable_illegible BETWEEN 0 AND 100)')
    this.schema.raw('ALTER TABLE font_metrics ADD CONSTRAINT font_metrics_display_text_chk CHECK (display_text BETWEEN 0 AND 100)')
    this.schema.raw('ALTER TABLE font_metrics ADD CONSTRAINT font_metrics_style_count_score_chk CHECK (style_count_score BETWEEN 0 AND 100)')
  }

  async down() {
    this.schema.dropTable('font_metrics')
    this.schema.dropTable('font_pricing_plans')
    this.schema.dropTable('font_supported_languages')
    this.schema.dropTable('font_style_format_files')
    this.schema.dropTable('font_formats')
    this.schema.dropTable('font_style_translations')
    this.schema.dropTable('font_styles')
    this.schema.dropTable('font_family_translations')
    this.schema.dropTable('font_families')
    this.schema.dropTable('font_filter_font')
    this.schema.dropTable('font_filters')
    this.schema.dropTable('font_translations')
    this.schema.dropTable('fonts')
  }
}
