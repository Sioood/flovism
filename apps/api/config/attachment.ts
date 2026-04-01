import { defineConfig } from '@jrmc/adonis-attachment'

import type { InferConverters } from '@jrmc/adonis-attachment/types/config'

const attachmentConfig = defineConfig({
  converters: {
    thumbnail: {
      resize: 300,
    },
  },
})

export default attachmentConfig

declare module '@jrmc/adonis-attachment' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AttachmentVariants extends InferConverters<typeof attachmentConfig> {}
}
