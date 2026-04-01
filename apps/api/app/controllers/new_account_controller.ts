import User from '#models/user'
import AuthService from '#services/auth_service'
import UserTransformer from '#transformers/user_transformer'
import { signupValidator } from '#validators/user'

import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  constructor(private readonly authService = new AuthService()) {}

  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)
    const user = await this.authService.signup({ fullName, email, password })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
