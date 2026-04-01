import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class ProjectNumberService {
  async nextForYear(projectYear: number, trx: TransactionClientContract) {
    const rows = await trx.from('projects').where('project_year', projectYear).forUpdate().select(['project_number'])

    let max = 0
    for (const row of rows) {
      const parts = String(row.project_number).split('-')
      const current = Number(parts[1] || '0')
      if (current > max) max = current
    }
    const next = String(max + 1).padStart(3, '0')
    return `${projectYear}-${next}`
  }
}
