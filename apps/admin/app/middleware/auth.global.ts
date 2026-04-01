export default defineNuxtRouteMiddleware((to) => {
  const { user } = extractStore(useUserStore())

  if (!user.value && to.path !== '/login') return navigateTo('/login')
})
