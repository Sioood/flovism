import { BaseModel, beforeCreate, column, belongsTo } from '@adonisjs/lucid/orm'
import { attachment } from '@jrmc/adonis-attachment'
import { DateTime } from 'luxon'

import User from '#models/user'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

export default class Upload extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(upload: Upload) {
    upload.id = upload.id || newId('upload')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare disk: string

  @column()
  declare key: string

  @column()
  declare originalName: string

  @column()
  declare extension: string | null

  @column()
  declare mimeType: string

  @column()
  declare size: number

  @column()
  declare checksum: string | null

  @column()
  declare visibility: string

  @attachment()
  declare file: Attachment | null

  @column()
  declare metadata: Record<string, unknown>

  @column()
  declare uploadedBy: string | null

  @belongsTo(() => User, { foreignKey: 'uploadedBy' })
  declare uploader: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}
