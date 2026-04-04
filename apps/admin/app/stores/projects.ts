import { defineStore } from 'pinia'

import { createTuyauCrud } from '~/utils/tuyau-crud'

import type { Route } from '@tuyau/core/types'
import type { CrudResult } from '~/utils/tuyau-crud'

const PROJECT_CRUD_ROUTES = {
  index: 'projects.index',
  show: 'projects.show',
  store: 'projects.store',
  update: 'projects.update',
  destroy: 'projects.destroy',
} as const

export const useProjectsStore = defineStore('projects', () => {
  const { $api } = useNuxtApp()

  const crud = createTuyauCrud<typeof PROJECT_CRUD_ROUTES>({
    client: $api,
    routes: PROJECT_CRUD_ROUTES,
    getScope: () => ({}),
    memberUrlParam: 'id',
  })

  const updateStatus = async (id: string, body: Route.Body<'projects.status'>): Promise<CrudResult<Route.Response<'projects.status'>>> => {
    const [data, error] = await $api.request('projects.status', { params: { id }, body }).safe()
    if (error) return { data: null, error }
    return { data, error: null }
  }

  return {
    ...crud,
    updateStatus,
  }
})
