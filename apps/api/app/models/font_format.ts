import { beforeCreate } from '@adonisjs/lucid/orm'

import { FontFormatSchema } from '#database/schema'
import { newId } from '#utils/custom_id'

export default class FontFormat extends FontFormatSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontFormat) {
    model.id = model.id || newId('fontFormat')
  }
}
