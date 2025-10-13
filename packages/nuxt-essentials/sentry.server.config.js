import * as Sentry from '@sentry/nuxt'

import release from '~nuxt-essentials/utils/release'

if (process.env.NUXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
    release,
    integrations: [],
    tracesSampleRate: 0,
  })
}
