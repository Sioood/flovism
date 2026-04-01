import { BaseModel, beforeCreate, belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import Project from '#models/project'
import ProjectImageTranslation from '#models/project_image_translation'
import Upload from '#models/upload'
import { newId } from '#utils/custom_id'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class ProjectImage extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectImage) {
    model.id = model.id || newId('projectImage')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare uploadId: string

  @column()
  declare sortOrder: number

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Upload)
  declare upload: BelongsTo<typeof Upload>

  @hasMany(() => ProjectImageTranslation)
  declare translations: HasMany<typeof ProjectImageTranslation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
