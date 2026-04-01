import { test } from '@japa/runner'

import AuthorizationResponseService from '#services/authorization_response_service'

test.group('AuthorizationResponseService', () => {
  test('defaults to not found for unauthorized resource', ({ assert }) => {
    const service = new AuthorizationResponseService()
    let statusCode = 200
    let payload: unknown = null

    service.denyRead(
      {
        request: { header: () => null },
        response: {
          forbidden: (data: unknown) => {
            statusCode = 403
            payload = data
            return data
          },
          notFound: (data: unknown) => {
            statusCode = 404
            payload = data
            return data
          },
        },
      } as never,
      'Project',
    )

    assert.equal(statusCode, 404)
    assert.deepEqual(payload, { message: 'Project not found' })
  })
})
