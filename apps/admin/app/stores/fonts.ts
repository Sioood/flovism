import { defineStore } from 'pinia'

import { createTuyauCrud } from '~/utils/tuyau-crud'

import type { Route } from '@tuyau/core/types'
import type { CrudResult } from '~/utils/tuyau-crud'

const FONT_CRUD_ROUTES = {
  index: 'fonts.index',
  show: 'fonts.show',
  store: 'fonts.store',
  update: 'fonts.update',
  destroy: 'fonts.destroy',
} as const

export const useFontsStore = defineStore('fonts', () => {
  const { $api } = useNuxtApp()

  const crud = createTuyauCrud<typeof FONT_CRUD_ROUTES>({
    client: $api,
    routes: FONT_CRUD_ROUTES,
    getScope: () => ({}),
    memberUrlParam: 'id',
  })

  const updateStatus = async (id: string, body: Route.Body<'fonts.status'>): Promise<CrudResult<Route.Response<'fonts.status'>>> => {
    const [data, error] = await $api.request('fonts.status', { params: { id }, body }).safe()
    if (error) return { data: null, error }
    return { data, error: null }
  }

  return {
    ...crud,
    updateStatus,
  }
})
