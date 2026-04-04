<script setup lang="ts">
import { useMediaQuery, createReusableTemplate } from '@vueuse/core'

const [DefineDrawer, ReuseDrawer] = createReusableTemplate()
const selectedItem = ref<{ path: string } | null>(null)
const mobileMenuOpen = ref(false)

const isLargeScreen = useMediaQuery('(min-width: 1024px)', {
  ssrWidth: 1024,
})

watch(
  selectedItem,
  (newVal, oldVal) => {
    if (newVal?.path && newVal.path !== oldVal?.path) {
      navigateTo(newVal.path)
      mobileMenuOpen.value = false
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="flex">
    <DefineDrawer>
      <aside
        class="h-svh w-full transform bg-gray-200 transition-transform duration-200 ease-out"
        :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <Tree v-model:model-value="selectedItem" class="h-[calc(100vh-3.5rem)] w-full overflow-y-auto lg:h-svh" />
      </aside>
    </DefineDrawer>

    <ReuseDrawer v-if="isLargeScreen" class="fixed max-w-[15vw]" />
    <UIDrawer v-else v-model:open="mobileMenuOpen" direction="left" swipe-direction="start" :modal="true" @update:open="mobileMenuOpen = $event">
      <template #trigger>
        <UIButton size="sm" color="gray" icon-name="lucide:menu" class="fixed top-4 left-4 z-10" aria-label="Open menu" />
      </template>

      <ReuseDrawer />
    </UIDrawer>

    <div class="w-full overflow-y-auto p-8 pt-16" :class="isLargeScreen ? 'ml-[15vw]' : ''">
      <slot />
    </div>
  </div>
</template>
