<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const isLargeScreen = useMediaQuery('(min-width: 1024px)', { ssrWidth: 1024 })

const { pkg } = useRuntimeConfig().public

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="flex h-svh flex-col bg-gray-200">
    <span class="fixed right-2 bottom-2 text-xs text-gray-500 opacity-50 select-none" :title="pkg.name + '@' + pkg.version">
      {{ pkg.name }}@{{ pkg.version }}
    </span>

    <div class="flex items-center justify-between p-2">
      <UIDrawer v-model:open="mobileMenuOpen" direction="left" swipe-direction="start" :modal="true" @update:open="mobileMenuOpen = $event">
        <template #trigger>
          <UIButton v-if="!isLargeScreen" size="sm" color="gray" icon-name="ic:menu" :label="pkg.name" />
        </template>
        <Sidebar />
      </UIDrawer>
      <Nav />
    </div>

    <div class="flex size-full overflow-hidden">
      <div v-if="isLargeScreen" class="w-[20vw] shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      <div class="size-full overflow-y-auto bg-gray-100" :class="{ 'rounded-tl-2xl': isLargeScreen }">
        <slot />
      </div>
    </div>
  </div>
</template>
