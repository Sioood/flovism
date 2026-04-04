import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { UserSchema } from '#database/schema'
import Role from '#models/role'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static selfAssignPrimaryKey = true
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @beforeCreate()
  static assignId(user: User) {
    if (!user.id) {
      user.id = newId('user')
    }
  }

  @belongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof Role>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
