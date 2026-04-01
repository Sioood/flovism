import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ContentStatus extends BaseModel {
  @column({ isPrimary: true })
  declare code: string

  @column()
  declare label: string

  @column()
  declare position: number

  @column()
  declare isPublic: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
