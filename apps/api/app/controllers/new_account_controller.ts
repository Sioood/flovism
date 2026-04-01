import { roleIds } from '#constants/authorization'
import User from '#models/user'
import env from '#start/env'
import UserTransformer from '#transformers/user_transformer'
import { signupValidator } from '#validators/user'

import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const allowAutoFirstAdmin = env.get('AUTHZ_ALLOW_AUTO_FIRST_ADMIN') ?? true
    const existingUser = await User.query().select('id').first()
    const roleId = !existingUser && allowAutoFirstAdmin ? roleIds.admin : roleIds.user
    const user = await User.create({ fullName, email, password, roleId })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
