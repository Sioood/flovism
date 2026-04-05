import FontFormat from '#models/font_format'

export default class FontFormatService {
  listPaginated(page: number, perPage: number) {
    return FontFormat.query().orderBy('key', 'asc').paginate(page, perPage)
  }

  find(id: string) {
    return FontFormat.find(id)
  }

  async create(input: { key: string }) {
    return FontFormat.create({ key: input.key.trim() })
  }

  async update(id: string, input: { key?: string }) {
    const row = await FontFormat.findOrFail(id)
    if (input.key !== undefined) row.key = input.key.trim()
    await row.save()
    return row
  }

  async destroy(id: string) {
    const row = await FontFormat.findOrFail(id)
    await row.delete()
  }
}
