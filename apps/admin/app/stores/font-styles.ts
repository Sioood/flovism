import { defineStore } from 'pinia'

import { createTuyauCrud } from '~/utils/tuyau-crud'

const FONT_STYLE_CRUD_ROUTES = {
  index: 'font_styles.index',
  show: 'font_styles.show',
  store: 'font_styles.store',
  update: 'font_styles.update',
  destroy: 'font_styles.destroy',
} as const

export const useFontStylesStore = defineStore('fontStyles', () => {
  const { $api } = useNuxtApp()
  const activeFontId = ref<string | null>(null)

  const crud = createTuyauCrud<typeof FONT_STYLE_CRUD_ROUTES>({
    client: $api,
    routes: FONT_STYLE_CRUD_ROUTES,
    getScope: () => {
      const id = activeFontId.value
      if (!id) throw new Error('fontStyles: set active font id before calling the API')
      return { fontId: id }
    },
    memberUrlParam: 'styleId',
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
