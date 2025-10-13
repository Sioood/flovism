import { getMessagesWithNamespace } from '~nuxt-essentials/i18n/utils/namespace'

export default defineI18nLocale(async () => {
  const namespacesFiles = {
    translations: () => import('./translations.json'),
  }

  return await getMessagesWithNamespace(namespacesFiles)
})
