<script setup lang="ts">
const selectedItem = ref<{ path: string } | null>(null)
const mobileMenuOpen = ref(false)

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
    <UIButton
      size="sm"
      color="gray"
      icon-name="lucide:menu"
      class="fixed top-4 left-4 z-1000 lg:hidden"
      aria-label="Open menu"
      @click="mobileMenuOpen = true"
    />

    <div
      class="fixed inset-0 z-999 bg-black/50 transition-opacity lg:hidden"
      :class="mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
      aria-hidden="true"
      @click="mobileMenuOpen = false"
    />

    <aside
      class="fixed top-0 left-0 z-1000 h-svh w-[80vw] max-w-sm transform bg-gray-200 transition-transform duration-200 ease-out lg:z-auto lg:flex lg:h-auto lg:w-[15vw] lg:max-w-none lg:translate-x-0 lg:bg-transparent"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="flex items-center justify-end p-4 lg:hidden">
        <UIButton size="sm" icon-name="lucide:x" aria-label="Close menu" @click="mobileMenuOpen = false" />
      </div>
      <Tree v-model:model-value="selectedItem" class="h-[calc(100vh-3.5rem)] w-full overflow-y-auto lg:h-svh" />
    </aside>

    <div class="min-h-svh w-full overflow-y-auto p-8 pt-16 lg:ml-[15vw] lg:w-[85vw] lg:pt-8">
      <slot />
    </div>
  </div>
</template>
