import db from '@adonisjs/lucid/services/db'

import Project from '#models/project'
import ProjectImage from '#models/project_image'
import ProjectNumberService from '#services/project_number_service'
import PublicationService from '#services/publication_service'
import ProjectRepository from '#services/repositories/project_repository'
import UploadService from '#services/upload_service'
import { newId } from '#utils/custom_id'

import { ContentStatuses, type ContentStatusCode } from '../enums/content_status.js'

export default class ProjectService {
  constructor(
    private readonly repository = new ProjectRepository(),
    private readonly publicationService = new PublicationService(),
    private readonly projectNumberService = new ProjectNumberService(),
    private readonly uploadService = new UploadService(),
  ) {}

  async listPaginated(languageCode: string, options: { publishedOnly?: boolean } | undefined, page: number, perPage: number) {
    const paginated = (await this.repository.listPaginated(languageCode, options, page, perPage)) as { all(): Project[]; getMeta(): unknown }
    const hydrated = await Promise.all(paginated.all().map((project) => this.withImages(project, languageCode)))
    return { rows: hydrated, paginator: paginated }
  }

  async show(id: string, languageCode: string, options?: { publishedOnly?: boolean }) {
    const project = await this.repository.byId(id, languageCode, options)
    if (!project) return null
    return this.withImages(project as Project, languageCode)
  }

  private async withImages(project: Project, languageCode: string): Promise<Project> {
    project.mergeTranslations(languageCode)

    const rows = await db
      .from('project_images')
      .innerJoin('uploads', 'project_images.upload_id', 'uploads.id')
      .leftJoin('project_image_translations as tr', (join) => {
        join.on('project_images.id', '=', 'tr.project_image_id').andOnVal('tr.language_code', '=', languageCode)
      })
      .leftJoin('project_image_translations as tr_fr', (join) => {
        join.on('project_images.id', '=', 'tr_fr.project_image_id').andOnVal('tr_fr.language_code', '=', 'fr_FR')
      })
      .where('project_images.project_id', project.id)
      .select([
        'project_images.id',
        'project_images.sort_order',
        'uploads.id as upload_id',
        'uploads.disk',
        'uploads.key',
        'uploads.visibility',
        db.raw('COALESCE(tr.alt, tr_fr.alt) as alt'),
      ])
      .orderBy('project_images.sort_order', 'asc')

    const images = await Promise.all(
      rows.map(async (row: { id: string; upload_id: string; sort_order: number; disk: string; key: string; visibility: string; alt: string | null }) => ({
        id: row.id,
        uploadId: row.upload_id,
        sortOrder: row.sort_order,
        alt: row.alt || null,
        url: await this.uploadService.getUrl({
          disk: row.disk,
          key: row.key,
          visibility: row.visibility,
        }),
      })),
    )

    project.apiImages = images
    return project
  }

  async create(
    input: {
      projectYear: number
      categoryIds?: string[]
      images?: Array<{ uploadId: string; sortOrder?: number; alts?: Record<string, { alt: string }> }>
      translations: Record<string, { slug: string; name: string; description: string; client_name?: string | null; credit?: string | null }>
      statusCode?: ContentStatusCode
    },
    languageCode: string,
  ) {
    const trx = await db.transaction()
    try {
      const projectNumber = await this.projectNumberService.nextForYear(input.projectYear, trx)
      const project = await Project.create(
        {
          projectNumber,
          projectYear: input.projectYear,
          statusCode: input.statusCode || ContentStatuses.draft,
        },
        { client: trx },
      )

      await project.saveTranslations(input.translations, trx)

      if (input.categoryIds?.length) {
        await trx
          .table('project_category_project')
          .insert(input.categoryIds.map((projectCategoryId) => ({ project_id: project.id, project_category_id: projectCategoryId })))
      }

      if (input.images?.length) {
        for (const image of input.images) {
          const projectImageId = newId('projectImage')
          await trx.table('project_images').insert({
            id: projectImageId,
            project_id: project.id,
            upload_id: image.uploadId,
            sort_order: image.sortOrder || 0,
          })

          if (image.alts) {
            const translationRows = Object.entries(image.alts).map(([lang, { alt }]) => ({
              id: newId('projectImageTranslation'),
              project_image_id: projectImageId,
              language_code: lang,
              alt,
            }))
            if (translationRows.length) {
              await trx.table('project_image_translations').insert(translationRows)
            }
          }
        }
      }
      await trx.commit()
      const hydrated = await this.show(project.id, languageCode, { publishedOnly: false })
      if (!hydrated) throw new Error('Project not found after create')
      return hydrated
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async update(
    id: string,
    input: {
      projectYear?: number
      categoryIds?: string[]
      images?: Array<{ uploadId: string; sortOrder?: number; alts?: Record<string, { alt: string }> }>
      translations?: Record<string, { slug: string; name: string; description: string; client_name?: string | null; credit?: string | null }>
    },
    languageCode: string,
  ) {
    const trx = await db.transaction()
    try {
      const project = await Project.findOrFail(id, { client: trx })
      if (input.projectYear) project.projectYear = input.projectYear
      await project.save()

      if (input.translations) {
        await project.saveTranslations(input.translations, trx)
      }

      if (input.categoryIds) {
        await trx.from('project_category_project').where('project_id', project.id).delete()
        if (input.categoryIds.length) {
          await trx
            .table('project_category_project')
            .insert(input.categoryIds.map((projectCategoryId) => ({ project_id: project.id, project_category_id: projectCategoryId })))
        }
      }

      if (input.images) {
        const existingImageIds = await trx.from('project_images').where('project_id', project.id).select('id')
        if (existingImageIds.length) {
          const imageIds = existingImageIds.map((row: { id: string }) => row.id)
          await trx.from('project_image_translations').whereIn('project_image_id', imageIds).delete()
        }
        await trx.from('project_images').where('project_id', project.id).delete()

        for (const image of input.images) {
          const projectImageId = newId('projectImage')
          await trx.table('project_images').insert({
            id: projectImageId,
            project_id: project.id,
            upload_id: image.uploadId,
            sort_order: image.sortOrder || 0,
          })

          if (image.alts) {
            const translationRows = Object.entries(image.alts).map(([lang, { alt }]) => ({
              id: newId('projectImageTranslation'),
              project_image_id: projectImageId,
              language_code: lang,
              alt,
            }))
            if (translationRows.length) {
              await trx.table('project_image_translations').insert(translationRows)
            }
          }
        }
      }

      await trx.commit()
      const hydrated = await this.show(id, languageCode, { publishedOnly: false })
      if (!hydrated) throw new Error('Project not found after update')
      return hydrated
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async destroy(id: string) {
    const project = await Project.findOrFail(id)
    await project.delete()
  }

  async attachImage(params: { projectId: string; uploadId: string; sortOrder?: number }) {
    return ProjectImage.create({
      id: newId('projectImage'),
      projectId: params.projectId,
      uploadId: params.uploadId,
      sortOrder: params.sortOrder || 0,
    })
  }

  async transitionStatus(id: string, to: ContentStatusCode, scheduledAt: string | null | undefined, languageCode: string) {
    const project = await Project.findOrFail(id)
    this.publicationService.validateTransition(project.statusCode as ContentStatusCode, to)
    const payload = this.publicationService.buildStatusPayload(to, scheduledAt)
    await project
      .merge({
        statusCode: payload.status_code,
        scheduledAt: payload.scheduled_at || null,
        publishedAt: payload.published_at || null,
      })
      .save()
    const hydrated = await this.show(id, languageCode, { publishedOnly: false })
    if (!hydrated) throw new Error('Project not found after status transition')
    return hydrated
  }
}
