import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { consola } from 'consola'
import { colorize } from 'consola/utils'
import esMain from 'es-main'
import { default as minimist } from 'minimist'

interface Argv extends minimist.ParsedArgs {
  f?: string
  ns?: boolean
}

const locales = {
  'fr-FR': 'Français',
  'en-US': 'English',
}

const treeCharacthers = {
  CHILD: '├── ',
  LAST_CHILD: '└── ',
  DIRECTORY: '│   ',
  EMPTY: '    ',
}

type Locale = keyof typeof locales

interface MessagesByLocale {
  [locale: string]: { [key: string]: string }
}

type CoverageData = { data: { total: number }; locale: { [locale: string]: { percentage: number; count: number; missing: number } } }

export const getLocales = (localesPath: string): Locale[] => readdirSync(localesPath) as (keyof typeof locales)[]
export const getLocaleNamespaces = ({ localesPath, locale }: { localesPath: string; locale: Locale }) =>
  readdirSync(join(localesPath, locale)).filter((f) => f.split('.')[f.split('.').length - 1] === 'json')

export const getTreeStructure = ({ localesPath, showNamespaces }: { localesPath: string; showNamespaces?: boolean }): [Locale, string[]][] => {
  const locales = getLocales(localesPath)

  const tree: [Locale, string[]][] = []

  for (const locale of locales) {
    tree.push([locale, []])

    if (showNamespaces) {
      const namespaces = getLocaleNamespaces({ localesPath: localesPath, locale })
      tree[tree.length - 1]![1] = namespaces
    }
  }

  return tree
}

// NOTE using consola formatTree might be better
export const renderTreeStructure = ({ tree, data }: { tree: [Locale, string[]][]; data?: CoverageData }): string[] => {
  const lines: string[] = ['.']

  for (const [locale, namespaces] of tree) {
    const isLocaleLast = tree[tree.length - 1]![0] === locale
    const localeConnector = isLocaleLast ? treeCharacthers.LAST_CHILD : treeCharacthers.CHILD
    lines.push(`${localeConnector}${locale} (${locales[locale]})`)

    const localeCoverage = data?.locale[locale]

    if (localeCoverage) {
      const coverageBgColor = localeCoverage.percentage >= 90 ? 'bgGreen' : localeCoverage.percentage >= 50 ? 'bgYellow' : 'bgRed'
      lines[lines.length - 1] +=
        ` ${colorize(coverageBgColor, ` ${colorize('bold', `${localeCoverage.percentage}%`)} `)} count: ${colorize('bold', localeCoverage.count)}, missing: ${colorize('bold', localeCoverage.missing)}`
    }

    for (let i = 0; i < namespaces.length; i++) {
      const folderConnector = isLocaleLast ? treeCharacthers.EMPTY : treeCharacthers.DIRECTORY
      const namespace = namespaces[i]
      const isNamespaceLast = i === namespaces.length - 1
      const connector = isNamespaceLast ? treeCharacthers.LAST_CHILD : treeCharacthers.CHILD
      lines.push(`${folderConnector}${connector}${namespace}`)
    }
  }

  return lines
}

export const getMessagesByLocaleWithNamespace = ({ locales, localesPath }: { locales: Locale[]; localesPath: string }) => {
  const messagesByLocale: MessagesByLocale = {}

  for (const locale of locales) {
    const translations = readdirSync(join(localesPath, locale)).filter((f) => f.split('.')[f.split('.').length - 1] === 'json')
    for (const translation of translations) {
      const namespace = translation.split('.')[0]

      const messages = JSON.parse(readFileSync(join(localesPath, locale, translation), 'utf-8'))

      if (!messagesByLocale[locale]) {
        messagesByLocale[locale] = {}
      }

      for (const key in messages) {
        if (namespace === 'translations') {
          messagesByLocale[locale][key] = messages[key]
        } else {
          messagesByLocale[locale][`${namespace}:${key}`] = messages[key]
        }
      }
    }
  }

  return messagesByLocale
}

export const getUniqueMessageKeys = (messagesByLocale: MessagesByLocale): string[] => {
  const uniqueMessageKeys = new Set<string>()

  for (const locale in messagesByLocale) {
    for (const key in messagesByLocale[locale]) {
      uniqueMessageKeys.add(key)
    }
  }

  return Array.from(uniqueMessageKeys)
}

export const getCoverageData = ({
  messagesByLocale,
  uniqueMessageKeys,
}: {
  messagesByLocale: MessagesByLocale
  uniqueMessageKeys: string[]
}): { data: { total: number }; locale: { [locale: string]: { percentage: number; count: number; missing: number } } } => {
  const coverage: { [locale: string]: { [key: string]: boolean } } = {}
  for (const locale in messagesByLocale) {
    coverage[locale] = {}
    for (const key in messagesByLocale[locale]) {
      coverage[locale][key] = uniqueMessageKeys.includes(key)
    }
  }

  return {
    data: {
      total: uniqueMessageKeys.length,
    },
    locale: Object.fromEntries(
      Object.entries(coverage).map(([locale, keys]) => [
        locale,
        {
          percentage: (Object.values(keys).length / uniqueMessageKeys.length) * 100,
          count: Object.values(keys).length,
          missing: uniqueMessageKeys.length - Object.values(keys).length,
        },
      ]),
    ),
  }
}

export const renderCoverage = ({ localesPath, showNamespaces }: { localesPath: string; showNamespaces?: boolean }) => {
  const locales = getLocales(localesPath)
  consola.start(`Running coverage of 📂 Locales: ${localesPath}`)

  const messagesByLocale = getMessagesByLocaleWithNamespace({ locales, localesPath })
  const coverageData = getCoverageData({ messagesByLocale, uniqueMessageKeys: getUniqueMessageKeys(messagesByLocale) })

  const treeRender = renderTreeStructure({ tree: getTreeStructure({ localesPath, showNamespaces }), data: coverageData })

  consola.log('')
  consola.success(`Coverage of ${colorize('bold', coverageData.data.total)} unique translations`)
  for (const line of treeRender) {
    consola.log(line)
  }
  consola.log('')
}

// run coverage if executed directly from terminal
if (esMain(import.meta)) {
  const argv: Argv = minimist(process.argv.slice(2))

  if (!argv.f) {
    consola.error('❌ Please provide a path as an argument.')
    consola.error('Usage: ... -f ./i18n/locales')
    process.exit(1)
  }

  const localesPath = resolve(argv.f)
  renderCoverage({ localesPath, showNamespaces: argv.ns })
}
