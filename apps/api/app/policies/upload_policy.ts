import { BasePolicy } from '@adonisjs/bouncer'

import { roleIds } from '#constants/authorization'

import type Upload from '#models/upload'
import type User from '#models/user'

export default class UploadPolicy extends BasePolicy {
  private isAdmin(user: User) {
    return user.roleId === roleIds.admin
  }

  viewList(_user: User) {
    return true
  }

  view(user: User, upload: Upload | { visibility: string }) {
    return this.isAdmin(user) || upload.visibility === 'public'
  }

  create(user: User) {
    return this.isAdmin(user)
  }

  delete(user: User) {
    return this.isAdmin(user)
  }
}
