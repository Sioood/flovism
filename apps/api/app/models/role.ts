import { beforeCreate, hasMany } from '@adonisjs/lucid/orm'

import { RoleSchema } from '#database/schema'
import User from '#models/user'
import { newId } from '#utils/custom_id'

import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Role extends RoleSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(role: Role) {
    role.id = role.id || newId('role')
  }

  @hasMany(() => User, { foreignKey: 'roleId' })
  declare users: HasMany<typeof User>
}
