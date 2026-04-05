import Project from '#models/project'

export default class ProjectRepository {
  buildListQuery(languageCode: string, options?: { publishedOnly?: boolean }) {
    const query = Project.query()
      .withScopes((scopes: unknown) => (scopes as { withTranslations: (lang: string) => unknown }).withTranslations(languageCode))
      .orderBy('createdAt', 'desc')

    if (options?.publishedOnly) {
      query.where('statusCode', 'published')
    }

    return query
  }

  async listPaginated(languageCode: string, options: { publishedOnly?: boolean } | undefined, page: number, perPage: number) {
    return this.buildListQuery(languageCode, options).paginate(page, perPage)
  }

  async byId(id: string, languageCode: string, options?: { publishedOnly?: boolean }): Promise<Project | null> {
    return this.buildListQuery(languageCode, options).where('id', id).first()
  }
}
