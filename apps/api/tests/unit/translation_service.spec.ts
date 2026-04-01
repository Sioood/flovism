import { test } from '@japa/runner'

import TranslationService from '#services/translation_service'

test.group('TranslationService', () => {
  test('requires fr_FR payload', ({ assert }) => {
    const service = new TranslationService()
    assert.throws(() => service.ensureDefaultLanguagePayload({ en_US: { name: 'Only EN' } }))
  })
})
