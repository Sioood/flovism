import { registry } from '@flovism/api/registry'
import { createTuyau } from '@tuyau/core/client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = createTuyau({
    baseUrl: config.public.apiUrl || 'http://localhost:3333',
    registry,
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  return {
    provide: {
      api,
    },
  }
})
