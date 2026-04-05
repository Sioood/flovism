import { BaseTransformer } from '@adonisjs/core/transformers'

import ProjectImageTransformer from '#transformers/project_image_transformer'

import type Project from '#models/project'

export default class ProjectTransformer extends BaseTransformer<Project> {
  constructor(
    resource: Project,
    protected languageCode: string = 'fr_FR',
  ) {
    super(resource)
  }

  toObject() {
    this.resource.mergeTranslations(this.languageCode)
    return this.pickModel(this.resource)
  }

  /**
   * Lighter shape for index views (omits description).
   */
  forList() {
    this.resource.mergeTranslations(this.languageCode)
    return this.pickModel(this.resource, false)
  }

  private pickMergedString(model: Project, key: string): string {
    const loose = model as unknown as Record<string, unknown>
    const attrs = (model as unknown as { $attributes: Record<string, unknown> }).$attributes
    const v = loose[key] ?? attrs[key]
    return String(v ?? '')
  }

  private pickModel(model: Project, includeDescription = true) {
    return {
      ...this.pick(model, [
        'id',
        'projectNumber',
        'projectYear',
        'statusCode',
        'scheduledAt',
        'publishedAt',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt',
      ]),
      name: this.pickMergedString(model, 'name'),
      slug: this.pickMergedString(model, 'slug'),
      ...(includeDescription && { description: this.pickMergedString(model, 'description') }),
      images: ProjectImageTransformer.transform(model.apiImages ?? []),
    }
  }
}
