import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { ProjectTranslationSchema } from '#database/schema'
import Language from '#models/language'
import Project from '#models/project'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProjectTranslation extends ProjectTranslationSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectTranslation) {
    model.id = model.id || newId('projectTranslation')
  }

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
