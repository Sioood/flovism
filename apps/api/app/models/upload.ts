import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { attachment } from '@jrmc/adonis-attachment'

import { UploadSchema } from '#database/schema'
import User from '#models/user'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class Upload extends UploadSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(upload: Upload) {
    upload.id = upload.id || newId('upload')
  }

  @attachment()
  declare file: Attachment | null

  @belongsTo(() => User, { foreignKey: 'uploadedBy' })
  declare uploader: BelongsTo<typeof User>
}
