import { defineStore } from 'pinia'

import type { Data } from '@flovism/api/data'

export const useUserStore = defineStore('user', () => {
  const { $api } = useNuxtApp()
  const toaster = useToast()

  const user = useCookie<Data.User | null>('user', {
    default: () => null,
  })

  const signup = async ({ email, password, fullName }: { email: Data.User['email']; password: string; fullName: Data.User['fullName'] }) => {
    try {
      const response = await $api.api.webAuth.signup({ body: { email, password, fullName, passwordConfirmation: password } })
      user.value = response.data.user
      toaster.value?.create({ type: 'success', title: 'signupSuccess' })
    } catch {
      toaster.value?.create({ type: 'error', title: 'signupFailed' })
    }
  }

  const login = async (email: Data.User['email'], password: string) => {
    try {
      const response = await $api.api.webAuth.login({ body: { email, password } })
      user.value = response.data.user
      toaster.value?.create({ type: 'success', title: 'loginSuccess' })
    } catch {
      toaster.value?.create({ type: 'error', title: 'loginFailed' })
    }
  }

  const logout = async () => {
    try {
      await $api.api.webAuth.logout({})
      user.value = null
      toaster.value?.create({ type: 'success', title: 'logoutSuccess' })
    } catch {
      toaster.value?.create({ type: 'error', title: 'logoutFailed' })
    }
  }

  return { user, signup, login, logout }
})
