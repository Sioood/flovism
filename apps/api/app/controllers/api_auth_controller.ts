import User from '#models/user'
import AuthService from '#services/auth_service'
import UserTransformer from '#transformers/user_transformer'
import { loginValidator, signupValidator } from '#validators/user'

import type { HttpContext } from '@adonisjs/core/http'

export default class ApiAuthController {
  constructor(private readonly authService = new AuthService()) {}

  async signup({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)
    const user = await this.authService.signup({ fullName, email, password })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async login({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await this.authService.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async logout({ auth }: HttpContext) {
    const user = await auth.use('api').authenticate()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return {
      message: 'Logged out successfully',
    }
  }
}
