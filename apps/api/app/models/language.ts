import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Language extends BaseModel {
  @column({ isPrimary: true })
  declare code: string

  @column()
  declare locale: string

  @column()
  declare country: string

  @column()
  declare endonym: string

  @column()
  declare isActive: boolean

  @column()
  declare isDefault: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
