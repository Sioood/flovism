import ProjectService from '#services/project_service'
import { createProjectValidator, projectStatusValidator, updateProjectValidator } from '#validators/project'

import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  constructor(private readonly projectService = new ProjectService()) {}

  async index({ request }: HttpContext) {
    const lang = String(request.qs().lang || 'fr_FR')
    return this.projectService.list(lang)
  }

  async show({ params, request, response }: HttpContext) {
    const lang = String(request.qs().lang || 'fr_FR')
    const project = await this.projectService.show(params.id, lang)
    if (!project) return response.notFound({ message: 'Project not found' })
    return project
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProjectValidator)
    const created = await this.projectService.create(payload as never)
    return response.created(created)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateProjectValidator)
    return this.projectService.update(params.id, payload as never)
  }

  async destroy({ params, response }: HttpContext) {
    await this.projectService.destroy(params.id)
    return response.ok({ success: true })
  }

  async status({ params, request }: HttpContext) {
    const payload = await request.validateUsing(projectStatusValidator)
    return this.projectService.transitionStatus(params.id, payload.statusCode, payload.scheduledAt)
  }
}
