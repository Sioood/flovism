import { roleIds } from '#constants/authorization'
import ProjectPolicy from '#policies/project_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import ProjectService from '#services/project_service'
import ProjectTransformer from '#transformers/project_transformer'
import { resolveListingPagination } from '#utils/listing_pagination'
import { createProjectValidator, projectStatusValidator, projectsIndexQueryValidator, updateProjectValidator } from '#validators/project'

import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  constructor(
    private readonly projectService = new ProjectService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async index({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(ProjectPolicy).authorize('viewList')
    const qs = await request.validateUsing(projectsIndexQueryValidator)
    const lang = qs.lang ?? 'fr_FR'
    const isAdmin = auth.user?.roleId === roleIds.admin
    const { page, limit } = resolveListingPagination(qs, auth.user?.roleId)
    const { rows, paginator } = await this.projectService.listPaginated(lang, { publishedOnly: !isAdmin }, page, limit)
    return serialize(ProjectTransformer.paginate(rows, paginator.getMeta()).useVariant('forList'))
  }

  async show(ctx: HttpContext) {
    const { params, request, auth, bouncer, response, serialize } = ctx
    const lang = String(request.qs().lang || 'fr_FR')
    const isAdmin = auth.user?.roleId === roleIds.admin
    const project = await this.projectService.show(params.id, lang, { publishedOnly: !isAdmin })
    if (!project) return response.notFound({ message: 'Project not found' })
    const row = project as Record<string, unknown>
    const statusCode = String(row.status_code ?? row.statusCode ?? '')
    const isAllowed = await bouncer.with(ProjectPolicy).allows('view', { statusCode })
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Project')
    }
    return serialize(ProjectTransformer.transform(project))
  }

  async store({ request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(ProjectPolicy).authorize('create')
    const payload = await request.validateUsing(createProjectValidator)
    const created = await this.projectService.create(payload as never)
    return response.created(await serialize(ProjectTransformer.transform(created)))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(ProjectPolicy).authorize('update')
    const payload = await request.validateUsing(updateProjectValidator)
    const updated = await this.projectService.update(params.id, payload as never)
    return serialize(ProjectTransformer.transform(updated))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(ProjectPolicy).authorize('delete')
    await this.projectService.destroy(params.id)
    return response.ok({ success: true })
  }

  async status({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(ProjectPolicy).authorize('status')
    const payload = await request.validateUsing(projectStatusValidator)
    const updated = await this.projectService.transitionStatus(params.id, payload.statusCode, payload.scheduledAt)
    return serialize(ProjectTransformer.transform(updated))
  }
}
