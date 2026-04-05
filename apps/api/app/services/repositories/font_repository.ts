import Font from '#models/font'

export default class FontRepository {
  buildListQuery(languageCode: string, options?: { publishedOnly?: boolean }) {
    const query = Font.query()
      .withScopes((scopes: unknown) => (scopes as { withTranslations: (lang: string) => unknown }).withTranslations(languageCode))
      .orderBy('createdAt', 'desc')

    if (options?.publishedOnly) {
      query.where('statusCode', 'published')
    }

    return query
  }

  listPaginated(languageCode: string, options: { publishedOnly?: boolean } | undefined, page: number, perPage: number) {
    return this.buildListQuery(languageCode, options).paginate(page, perPage)
  }

  async byId(id: string, languageCode: string, options?: { publishedOnly?: boolean }): Promise<Font | null> {
    return this.buildListQuery(languageCode, options).where('id', id).first()
  }
}
