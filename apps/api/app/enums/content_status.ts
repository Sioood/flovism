export const ContentStatuses = {
  draft: 'draft',
  inReview: 'in_review',
  scheduled: 'scheduled',
  published: 'published',
  archived: 'archived',
} as const

export type ContentStatusCode = (typeof ContentStatuses)[keyof typeof ContentStatuses]

export const publicStatuses = [ContentStatuses.published] as const
