import { roleIds } from '#constants/authorization'
import User from '#models/user'
import env from '#start/env'

export default class AuthService {
  async signup(input: { fullName: string | null; email: string; password: string }) {
    const allowAutoFirstAdmin = env.get('AUTHZ_ALLOW_AUTO_FIRST_ADMIN') ?? true
    const existingUser = await User.query().select('id').first()
    const roleId = !existingUser && allowAutoFirstAdmin ? roleIds.admin : roleIds.user

    return User.create({
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      roleId,
    })
  }

  async verifyCredentials(email: string, password: string) {
    return User.verifyCredentials(email, password)
  }
}
