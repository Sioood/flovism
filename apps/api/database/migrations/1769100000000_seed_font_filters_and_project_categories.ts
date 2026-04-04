import { BaseSchema } from '@adonisjs/lucid/schema'

function fontFilterRow(idSuffix: string, key: string) {
  return { id: `fontfilter_${idSuffix}`, key }
}

function projectCategoryRow(idSuffix: string, key: string) {
  return { id: `prjcat_${idSuffix}`, key }
}

export default class extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      await db
        .table('font_filters')
        .insert([
          fontFilterRow('sans', 'sans'),
          fontFilterRow('serif', 'serif'),
          fontFilterRow('script', 'script'),
          fontFilterRow('rounded', 'rounded'),
          fontFilterRow('mono', 'mono'),
          fontFilterRow('fun', 'fun'),
          fontFilterRow('display', 'display'),
          fontFilterRow('text', 'text'),
          fontFilterRow('unreadable', 'unreadable'),
          fontFilterRow('readable', 'readable'),
          fontFilterRow('free', 'free'),
          fontFilterRow('paid', 'paid'),
          fontFilterRow('monospace', 'monospace'),
        ])

      await db
        .table('project_categories')
        .insert([
          projectCategoryRow('typography', 'typography'),
          projectCategoryRow('visual_identity', 'visual_identity'),
          projectCategoryRow('edition', 'edition'),
          projectCategoryRow('ui_design', 'ui_design'),
          projectCategoryRow('clothing', 'clothing'),
          projectCategoryRow('photography', 'photography'),
        ])
    })
  }

  async down() {
    this.defer(async (db) => {
      await db
        .from('font_filters')
        .whereIn('key', ['sans', 'serif', 'script', 'rounded', 'mono', 'fun', 'display', 'text', 'unreadable', 'readable', 'free', 'paid', 'monospace'])
        .delete()

      await db.from('project_categories').whereIn('key', ['typography', 'visual_identity', 'edition', 'ui_design', 'clothing', 'photography']).delete()
    })
  }
}
