/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/', () => {
  return { hell: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [() => import('#controllers/web_auth_controller'), 'signup'])
        router.post('login', [() => import('#controllers/web_auth_controller'), 'login'])
        router.post('logout', [() => import('#controllers/web_auth_controller'), 'logout']).use(middleware.auth({ guards: ['web'] }))
      })
      .prefix('auth/web')

    router
      .group(() => {
        router.post('signup', [() => import('#controllers/api_auth_controller'), 'signup'])
        router.post('login', [() => import('#controllers/api_auth_controller'), 'login'])
        router.post('logout', [() => import('#controllers/api_auth_controller'), 'logout']).use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('auth/api')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .group(() => {
        router.get('/', [controllers.Projects, 'index'])
        router.get('/:id', [controllers.Projects, 'show'])
        router.post('/', [controllers.Projects, 'store'])
        router.patch('/:id', [controllers.Projects, 'update'])
        router.delete('/:id', [controllers.Projects, 'destroy'])
        router.patch('/:id/status', [controllers.Projects, 'status'])
      })
      .prefix('projects')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .group(() => {
        router.get('/:fontId/styles', [controllers.FontStyles, 'index'])
        router.post('/:fontId/styles', [controllers.FontStyles, 'store'])
        router.get('/:fontId/styles/:styleId', [controllers.FontStyles, 'show'])
        router.patch('/:fontId/styles/:styleId', [controllers.FontStyles, 'update'])
        router.delete('/:fontId/styles/:styleId', [controllers.FontStyles, 'destroy'])

        router.get('/:fontId/families', [controllers.FontFamilies, 'index'])
        router.post('/:fontId/families', [controllers.FontFamilies, 'store'])
        router.get('/:fontId/families/:familyId', [controllers.FontFamilies, 'show'])
        router.patch('/:fontId/families/:familyId', [controllers.FontFamilies, 'update'])
        router.delete('/:fontId/families/:familyId', [controllers.FontFamilies, 'destroy'])

        router.get('/:fontId/metrics', [controllers.FontMetrics, 'show'])
        router.patch('/:fontId/metrics', [controllers.FontMetrics, 'update'])
        router.delete('/:fontId/metrics', [controllers.FontMetrics, 'destroy'])

        router.get('/', [controllers.Fonts, 'index'])
        router.get('/:id', [controllers.Fonts, 'show'])
        router.post('/', [controllers.Fonts, 'store'])
        router.patch('/:id', [controllers.Fonts, 'update'])
        router.delete('/:id', [controllers.Fonts, 'destroy'])
        router.patch('/:id/status', [controllers.Fonts, 'status'])
      })
      .prefix('fonts')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .group(() => {
        router.get('/', [controllers.FontFormats, 'index'])
        router.get('/:id', [controllers.FontFormats, 'show'])
        router.post('/', [controllers.FontFormats, 'store'])
        router.patch('/:id', [controllers.FontFormats, 'update'])
        router.delete('/:id', [controllers.FontFormats, 'destroy'])
      })
      .prefix('font-formats')
      .use(middleware.auth({ guards: ['web', 'api'] }))

    router
      .group(() => {
        router.get('/', [controllers.Uploads, 'index'])
        router.get('/:id', [controllers.Uploads, 'show'])
        router.post('/', [controllers.Uploads, 'store'])
        router.delete('/:id', [controllers.Uploads, 'destroy'])
      })
      .prefix('uploads')
      .use(middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('/api/v1')
