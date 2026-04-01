import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import User from '#models/user'
import { newId } from '#utils/custom_id'

import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Role extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(role: Role) {
    role.id = role.id || newId('role')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare code: string

  @column()
  declare label: string

  @hasMany(() => User, { foreignKey: 'roleId' })
  declare users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
