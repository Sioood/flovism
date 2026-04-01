import { test } from '@japa/runner'

import { roleIds } from '#constants/authorization'
import FontPolicy from '#policies/font_policy'
import ProjectPolicy from '#policies/project_policy'
import UploadPolicy from '#policies/upload_policy'

test.group('Policies', () => {
  const adminUser = { roleId: roleIds.admin }
  const standardUser = { roleId: roleIds.user }

  test('admin has full access on project', ({ assert }) => {
    const policy = new ProjectPolicy()
    assert.isTrue(policy.create(adminUser as never))
    assert.isTrue(policy.update(adminUser as never))
    assert.isTrue(policy.delete(adminUser as never))
    assert.isTrue(policy.status(adminUser as never))
    assert.isTrue(policy.view(adminUser as never, { statusCode: 'draft' }))
  })

  test('user can only view published projects', ({ assert }) => {
    const policy = new ProjectPolicy()
    assert.isTrue(policy.view(standardUser as never, { statusCode: 'published' }))
    assert.isFalse(policy.view(standardUser as never, { statusCode: 'draft' }))
    assert.isFalse(policy.create(standardUser as never))
  })

  test('user can only view published fonts', ({ assert }) => {
    const policy = new FontPolicy()
    assert.isTrue(policy.view(standardUser as never, { statusCode: 'published' }))
    assert.isFalse(policy.view(standardUser as never, { statusCode: 'in_review' }))
    assert.isFalse(policy.update(standardUser as never))
  })

  test('user can only view public uploads', ({ assert }) => {
    const policy = new UploadPolicy()
    assert.isTrue(policy.view(standardUser as never, { visibility: 'public' }))
    assert.isFalse(policy.view(standardUser as never, { visibility: 'private' }))
    assert.isFalse(policy.delete(standardUser as never))
  })
})
