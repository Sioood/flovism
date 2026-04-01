import db from '@adonisjs/lucid/services/db'

import Project from '#models/project'
import ProjectImage from '#models/project_image'
import ProjectNumberService from '#services/project_number_service'
import PublicationService from '#services/publication_service'
import ProjectRepository from '#services/repositories/project_repository'
import TranslationService from '#services/translation_service'
import UploadService from '#services/upload_service'
import { newId } from '#utils/custom_id'

import { ContentStatuses, type ContentStatusCode } from '../enums/content_status.js'

export default class ProjectService {
  constructor(
    private readonly repository = new ProjectRepository(),
    private readonly translationService = new TranslationService(),
    private readonly publicationService = new PublicationService(),
    private readonly projectNumberService = new ProjectNumberService(),
    private readonly uploadService = new UploadService(),
  ) {}

  async list(languageCode: string, options?: { publishedOnly?: boolean }) {
    const projects = await this.repository.list(languageCode, options)
    return Promise.all(projects.map((project) => this.withImages(project, languageCode)))
  }

  async show(id: string, languageCode: string, options?: { publishedOnly?: boolean }) {
    const project = await this.repository.byId(id, languageCode, options)
    if (!project) return null
    return this.withImages(project, languageCode)
  }

  private async withImages(project: { id: string } & Record<string, unknown>, languageCode: string) {
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
      rows.map(async (row) => ({
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

    return {
      ...project,
      images,
    }
  }

  async create(input: {
    projectYear: number
    categoryIds?: string[]
    images?: Array<{ uploadId: string; sortOrder?: number; alts?: Record<string, { alt: string }> }>
    translations: Record<string, { slug: string; name: string; description: string; client_name?: string | null; credit?: string | null }>
    statusCode?: ContentStatusCode
  }) {
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

      await this.translationService.upsertEntityTranslations({
        table: 'project_translations',
        ownerColumn: 'project_id',
        ownerId: project.id,
        translations: input.translations,
        trx,
      })

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
            const translationRows = Object.entries(image.alts).map(([languageCode, { alt }]) => ({
              id: newId('projectImageTranslation'),
              project_image_id: projectImageId,
              language_code: languageCode,
              alt,
            }))
            if (translationRows.length) {
              await trx.table('project_image_translations').insert(translationRows)
            }
          }
        }
      }
      await trx.commit()
      return project
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
  ) {
    const trx = await db.transaction()
    try {
      const project = await Project.findOrFail(id, { client: trx })
      if (input.projectYear) project.projectYear = input.projectYear
      await project.save()

      if (input.translations) {
        await this.translationService.upsertEntityTranslations({
          table: 'project_translations',
          ownerColumn: 'project_id',
          ownerId: project.id,
          translations: input.translations,
          trx,
        })
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
            const translationRows = Object.entries(image.alts).map(([languageCode, { alt }]) => ({
              id: newId('projectImageTranslation'),
              project_image_id: projectImageId,
              language_code: languageCode,
              alt,
            }))
            if (translationRows.length) {
              await trx.table('project_image_translations').insert(translationRows)
            }
          }
        }
      }

      await trx.commit()
      return project
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

  async transitionStatus(id: string, to: ContentStatusCode, scheduledAt?: string | null) {
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
    return project
  }
}
