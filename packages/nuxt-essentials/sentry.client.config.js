import * as Sentry from '@sentry/nuxt'

import { useRuntimeConfig } from '#imports'
import release from '~nuxt-essentials/utils/release'

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: useRuntimeConfig().public.sentry.dsn,
  release,
  integrations: [],
  tracesSampleRate: 0,
})
