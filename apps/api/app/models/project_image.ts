import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import { ProjectImageSchema } from '#database/schema'
import { Translatable } from '#mixins/translatable'
import Project from '#models/project'
import ProjectImageTranslation from '#models/project_image_translation'
import Upload from '#models/upload'
import { newId } from '#utils/custom_id'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class ProjectImage extends compose(ProjectImageSchema, Translatable) {
  static selfAssignPrimaryKey = true

  static translatableConfig = {
    table: 'project_image_translations',
    foreignKey: 'project_image_id',
    idPrefix: 'projectImageTranslation' as const,
    translatableColumns: ['alt'],
  }

  @beforeCreate()
  static assignId(model: ProjectImage) {
    model.id = model.id || newId('projectImage')
  }

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Upload)
  declare upload: BelongsTo<typeof Upload>

  @hasMany(() => ProjectImageTranslation)
  declare translations: HasMany<typeof ProjectImageTranslation>
}
