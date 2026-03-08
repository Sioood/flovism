<script setup lang="ts">
const selectedItem = ref<{ path: string } | null>(null)

watch(
  selectedItem,
  (newVal, oldVal) => {
    console.log('selectedItem', newVal, oldVal)
    if (newVal?.path && newVal.path !== oldVal?.path) return navigateTo(newVal.path)
  },
  { deep: true },
)
</script>

<template>
  <div class="flex">
    <Tree v-model:model-value="selectedItem" class="fixed z-999 h-svh w-[15vw]" />
    <div class="ml-[15vw] min-h-svh w-[85vw] overflow-y-auto p-8">
      <slot />
    </div>
  </div>
</template>
