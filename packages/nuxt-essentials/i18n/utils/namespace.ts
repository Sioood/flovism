export const prefixKeys = (prefix: string, obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [`${prefix}:${key}`, value]))

export const getMessagesWithNamespace = async (files: Record<string, () => Promise<{ default: Record<string, string> }>>) => {
  const namespaces = Object.keys(files)

  const messagesArray = await Promise.all(
    namespaces.map(async (name) => {
      const loadFn = files[name]
      if (!loadFn) {
        throw new Error(`Namespace "${name}" not found`)
      }
      const module = await loadFn()
      return name === 'translations' ? module.default : prefixKeys(name, module.default)
    }),
  )

  return Object.assign({}, ...messagesArray)
}
