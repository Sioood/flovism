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
        router.get('/', [controllers.Uploads, 'index'])
        router.get('/:id', [controllers.Uploads, 'show'])
        router.post('/', [controllers.Uploads, 'store'])
        router.delete('/:id', [controllers.Uploads, 'destroy'])
      })
      .prefix('uploads')
      .use(middleware.auth({ guards: ['web', 'api'] }))
  })
  .prefix('/api/v1')
