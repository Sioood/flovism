import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import { newId } from '#utils/custom_id'

export default class ProjectCategory extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectCategory) {
    model.id = model.id || newId('projectCategory')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare key: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
