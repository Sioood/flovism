import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { ProjectImageTranslationSchema } from '#database/schema'
import Language from '#models/language'
import ProjectImage from '#models/project_image'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProjectImageTranslation extends ProjectImageTranslationSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectImageTranslation) {
    model.id = model.id || newId('projectImageTranslation')
  }

  @belongsTo(() => ProjectImage)
  declare projectImage: BelongsTo<typeof ProjectImage>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
