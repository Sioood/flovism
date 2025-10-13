import { db } from '../server/utils/db'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      db,
    },
  }
})
