import { defineStore } from 'pinia'

import { createTuyauCrud } from '~/utils/tuyau-crud'

const FONT_FORMAT_CRUD_ROUTES = {
  index: 'font_formats.index',
  show: 'font_formats.show',
  store: 'font_formats.store',
  update: 'font_formats.update',
  destroy: 'font_formats.destroy',
} as const

export const useFontFormatsStore = defineStore('fontFormats', () => {
  const { $api } = useNuxtApp()

  const crud = createTuyauCrud<typeof FONT_FORMAT_CRUD_ROUTES>({
    client: $api,
    routes: FONT_FORMAT_CRUD_ROUTES,
    getScope: () => ({}),
    memberUrlParam: 'id',
  })

  return {
    ...crud,
  }
})
