import { resolveAuditUserId } from '#utils/audit_user_id'

type AuditedModel = {
  createdBy: string | null
  updatedBy: string | null
}

export function applyAuditBeforeCreate(model: AuditedModel) {
  const uid = resolveAuditUserId()
  if (!uid) return
  if (model.createdBy === null) model.createdBy = uid
  if (model.updatedBy === null) model.updatedBy = uid
}

export function applyAuditBeforeUpdate(model: AuditedModel) {
  const uid = resolveAuditUserId()
  if (!uid) return
  model.updatedBy = uid
}
