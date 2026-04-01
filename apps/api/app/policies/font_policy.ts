import { BasePolicy } from '@adonisjs/bouncer'

import { publishedStatusCode, roleIds } from '#constants/authorization'

import type Font from '#models/font'
import type User from '#models/user'

export default class FontPolicy extends BasePolicy {
  private isAdmin(user: User) {
    return user.roleId === roleIds.admin
  }

  viewList(_user: User) {
    return true
  }

  view(user: User, font: Font | { statusCode?: string }) {
    return this.isAdmin(user) || font.statusCode === publishedStatusCode
  }

  create(user: User) {
    return this.isAdmin(user)
  }

  update(user: User) {
    return this.isAdmin(user)
  }

  delete(user: User) {
    return this.isAdmin(user)
  }

  status(user: User) {
    return this.isAdmin(user)
  }
}
