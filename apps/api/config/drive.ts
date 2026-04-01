import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'

import env from '#start/env'

import type { InferDriveDisks } from '@adonisjs/drive/types'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      routeBasePath: '/uploads/files',
      serveFiles: true,
      visibility: 'private',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
