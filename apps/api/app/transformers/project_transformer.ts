import { BaseTransformer } from '@adonisjs/core/transformers'

import Project from '#models/project'
import ProjectImageTransformer, { type ProjectImagePublic } from '#transformers/project_image_transformer'

export type ProjectPublicRow = Record<string, unknown> & {
  id: string
  images: ProjectImagePublic[]
}

function isProjectModel(resource: Project | ProjectPublicRow): resource is Project {
  return resource instanceof Project
}

export default class ProjectTransformer extends BaseTransformer<Project | ProjectPublicRow> {
  toObject() {
    if (isProjectModel(this.resource)) {
      return this.pickModel(this.resource)
    }
    return this.resolvedLocalePayload()
  }

  /**
   * Lighter shape for index views (omits long description body).
   */
  forList() {
    if (isProjectModel(this.resource)) {
      return this.pickModel(this.resource)
    }
    const { description: _omit, ...rest } = this.publicLocalePayload()
    return rest
  }

  private pickModel(model: Project) {
    return this.pick(model, [
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
    ])
  }

  private resolvedLocalePayload() {
    if (isProjectModel(this.resource)) {
      return this.pickModel(this.resource)
    }
    return this.publicLocalePayload()
  }

  private publicLocalePayload() {
    const row = this.resource as Record<string, unknown>
    return {
      id: String(row.id ?? ''),
      projectNumber: String(row.project_number ?? row.projectNumber ?? ''),
      projectYear: Number(row.project_year ?? row.projectYear ?? 0),
      statusCode: String(row.status_code ?? row.statusCode ?? ''),
      scheduledAt: row.scheduled_at ?? row.scheduledAt ?? null,
      publishedAt: row.published_at ?? row.publishedAt ?? null,
      createdBy: row.created_by ?? row.createdBy ?? null,
      updatedBy: row.updated_by ?? row.updatedBy ?? null,
      createdAt: row.created_at ?? row.createdAt ?? null,
      updatedAt: row.updated_at ?? row.updatedAt ?? null,
      name: String(row.name ?? ''),
      slug: String(row.slug ?? ''),
      description: String(row.description ?? ''),
      images: ProjectImageTransformer.transform((this.resource as ProjectPublicRow).images),
    }
  }
}
