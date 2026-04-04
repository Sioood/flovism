import { defineStore } from 'pinia'

import { createTuyauCrud } from '~/utils/tuyau-crud'

const FONT_FAMILY_CRUD_ROUTES = {
  index: 'font_families.index',
  show: 'font_families.show',
  store: 'font_families.store',
  update: 'font_families.update',
  destroy: 'font_families.destroy',
} as const

export const useFontFamiliesStore = defineStore('fontFamilies', () => {
  const { $api } = useNuxtApp()
  const activeFontId = ref<string | null>(null)

  const crud = createTuyauCrud<typeof FONT_FAMILY_CRUD_ROUTES>({
    client: $api,
    routes: FONT_FAMILY_CRUD_ROUTES,
    getScope: () => {
      const id = activeFontId.value
      if (!id) throw new Error('fontFamilies: set active font id before calling the API')
      return { fontId: id }
    },
    memberUrlParam: 'familyId',
  })

  const setActiveFontId = (fontId: string | null) => {
    activeFontId.value = fontId
  }

  return {
    activeFontId,
    setActiveFontId,
    ...crud,
  }
})
