import { beforeCreate } from '@adonisjs/lucid/orm'

import { FontFilterSchema } from '#database/schema'
import { newId } from '#utils/custom_id'

export default class FontFilter extends FontFilterSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontFilter) {
    model.id = model.id || newId('fontFilter')
  }
}
