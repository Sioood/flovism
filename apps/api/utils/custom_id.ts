import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'

const nanoidLength = 24
export const nanoid = customAlphabet(nolookalikesSafe, nanoidLength)

export const ids = {
  user: 'user',
  role: 'role',
  language: 'lang',
  upload: 'upl',
  project: 'project',
  projectTranslation: 'prjtr',
  projectCategory: 'prjcat',
  projectImage: 'prjimg',
  projectImageTranslation: 'prjimgtr',
  font: 'font',
  fontTranslation: 'fonttr',
  fontFilter: 'fontfilter',
  fontFamily: 'fontfam',
  fontFamilyTranslation: 'fontfamtr',
  fontStyle: 'fontstyle',
  fontStyleTranslation: 'fontstyletr',
  fontFormat: 'fontformat',
  fontStyleFormatFile: 'fontfile',
  fontPricingPlan: 'fontprice',
}

export type IdPrefix = keyof typeof ids

export const newId = (prefix?: IdPrefix) => {
  if (prefix && !ids[prefix]) {
    throw new Error(`Invalid prefix: ${prefix}`)
  }
  if (!prefix) return nanoid()
  return `${ids[prefix]}_${nanoid()}`
}

export const isValidId = (id: `${IdPrefix}_${string}` | string) => {
  const [prefix = '', nanoidString] = id.split('_', 2)
  return prefix && ids[prefix as IdPrefix] && nanoidString.length === nanoidLength
}
