import { beforeCreate } from '@adonisjs/lucid/orm'

import { ProjectCategorySchema } from '#database/schema'
import { newId } from '#utils/custom_id'

export default class ProjectCategory extends ProjectCategorySchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: ProjectCategory) {
    model.id = model.id || newId('projectCategory')
  }
}
