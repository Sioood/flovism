import { BaseModel, beforeCreate, column, belongsTo } from '@adonisjs/lucid/orm'

import Language from '#models/language'
import ProjectImage from '#models/project_image'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProjectImageTranslation extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectImageTranslation) {
    model.id = model.id || newId('projectImageTranslation')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectImageId: string

  @column()
  declare languageCode: string

  @column()
  declare alt: string

  @belongsTo(() => ProjectImage)
  declare projectImage: BelongsTo<typeof ProjectImage>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
