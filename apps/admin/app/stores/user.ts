import { defineStore } from 'pinia'

import type { Data } from '../../../api/.adonisjs/client/data'

export const useUserStore = defineStore('user', () => {
  const { $api } = useNuxtApp()

  const user = useCookie<Data.User | null>('user', {
    default: () => null,
  })

  const signup = async ({ email, password, fullName }: { email: Data.User['email']; password: string; fullName: Data.User['fullName'] }) => {
    const response = await $api.api.webAuth.signup({ body: { email, password, fullName, passwordConfirmation: password } })
    user.value = response.data.user
  }

  const login = async (email: Data.User['email'], password: string) => {
    const response = await $api.api.webAuth.login({ body: { email, password } })
    user.value = response.data.user
  }

  const logout = async () => {
    await $api.api.webAuth.logout({})
    user.value = null
  }

  return { user, signup, login, logout }
})
