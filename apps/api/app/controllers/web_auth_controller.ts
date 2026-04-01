import AuthService from '#services/auth_service'
import UserTransformer from '#transformers/user_transformer'
import { loginValidator, signupValidator } from '#validators/user'

import type { HttpContext } from '@adonisjs/core/http'

export default class WebAuthController {
  constructor(private readonly authService = new AuthService()) {}

  async signup({ request, auth, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)
    const user = await this.authService.signup({ fullName, email, password })

    await auth.use('web').login(user)

    return serialize({
      user: UserTransformer.transform(user),
    })
  }

  async login({ request, auth, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await this.authService.verifyCredentials(email, password)

    await auth.use('web').login(user)

    return serialize({
      user: UserTransformer.transform(user),
    })
  }

  async logout({ auth }: HttpContext) {
    await auth.use('web').logout()

    return {
      message: 'Logged out successfully',
    }
  }
}
