import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)

const { eslint } = jiti('./src/index.ts')

export default eslint
