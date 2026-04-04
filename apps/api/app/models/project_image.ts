import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import { ProjectImageSchema } from '#database/schema'
import Project from '#models/project'
import ProjectImageTranslation from '#models/project_image_translation'
import Upload from '#models/upload'
import { newId } from '#utils/custom_id'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class ProjectImage extends ProjectImageSchema {
  static selfAssignPrimaryKey = true

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
