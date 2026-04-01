import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      await db.table('languages').insert([
        { code: 'fr_FR', locale: 'fr', country: 'FR', endonym: 'Français', is_active: true, is_default: true },
        { code: 'en_US', locale: 'en', country: 'US', endonym: 'English', is_active: true, is_default: false },
      ])

      await db.table('content_statuses').insert([
        { code: 'draft', label: 'Draft', position: 1, is_public: false },
        { code: 'in_review', label: 'In review', position: 2, is_public: false },
        { code: 'scheduled', label: 'Scheduled', position: 3, is_public: false },
        { code: 'published', label: 'Published', position: 4, is_public: true },
        { code: 'archived', label: 'Archived', position: 5, is_public: false },
      ])
    })
  }

  async down() {
    /**
     * Intentionally no-op.
     * These seeded rows are referenced by domain tables (projects/fonts/translations)
     * and are safely removed when base tables are dropped by older migrations.
     */
  }
}
