import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import Language from '#models/language'
import Project from '#models/project'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProjectTranslation extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectTranslation) {
    model.id = model.id || newId('projectTranslation')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare languageCode: string

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare clientName: string | null

  @column()
  declare credit: string | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
