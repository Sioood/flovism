import { test } from '@japa/runner'

import PublicationService from '#services/publication_service'

import { ContentStatuses } from '../../app/enums/content_status.js'

test.group('PublicationService', () => {
  test('allows valid status transition', ({ assert }) => {
    const service = new PublicationService()
    assert.doesNotThrow(() => service.validateTransition(ContentStatuses.draft, ContentStatuses.inReview))
  })

  test('rejects invalid status transition', ({ assert }) => {
    const service = new PublicationService()
    assert.throws(() => service.validateTransition(ContentStatuses.draft, ContentStatuses.published))
  })
})
