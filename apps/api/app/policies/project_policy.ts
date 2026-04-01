import { BasePolicy } from '@adonisjs/bouncer'

import { publishedStatusCode, roleIds } from '#constants/authorization'

import type Project from '#models/project'
import type User from '#models/user'

export default class ProjectPolicy extends BasePolicy {
  private isAdmin(user: User) {
    return user.roleId === roleIds.admin
  }

  viewList(_user: User) {
    return true
  }

  view(user: User, project: Project | { statusCode?: string }) {
    return this.isAdmin(user) || project.statusCode === publishedStatusCode
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
