import { DateTime } from 'luxon'

import { ContentStatuses, type ContentStatusCode } from '../enums/content_status.js'

const transitions: Record<ContentStatusCode, ContentStatusCode[]> = {
  draft: [ContentStatuses.inReview, ContentStatuses.archived],
  in_review: [ContentStatuses.scheduled, ContentStatuses.published, ContentStatuses.archived],
  scheduled: [ContentStatuses.published, ContentStatuses.archived],
  published: [ContentStatuses.archived],
  archived: [ContentStatuses.draft],
}

export default class PublicationService {
  validateTransition(from: ContentStatusCode, to: ContentStatusCode) {
    if (!transitions[from]?.includes(to)) {
      throw new Error(`Invalid status transition: ${from} -> ${to}`)
    }
  }

  buildStatusPayload(statusCode: ContentStatusCode, scheduledAt?: string | null) {
    const payload: { status_code: ContentStatusCode; published_at?: DateTime | null; scheduled_at?: DateTime | null } = {
      status_code: statusCode,
    }

    if (statusCode === ContentStatuses.scheduled) {
      payload.scheduled_at = scheduledAt ? DateTime.fromISO(scheduledAt) : null
      payload.published_at = null
      return payload
    }

    if (statusCode === ContentStatuses.published) {
      payload.published_at = DateTime.utc()
      payload.scheduled_at = null
      return payload
    }

    payload.published_at = null
    payload.scheduled_at = null
    return payload
  }
}
