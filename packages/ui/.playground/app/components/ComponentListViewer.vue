<script setup lang="ts">
const props = defineProps<{
  title: string
  view?: 'list' | 'grid'
}>()

const view = ref<'list' | 'grid'>(props.view || 'grid')
</script>

<template>
  <details class="flex flex-col gap-6" open>
    <summary class="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 p-3">
      <h1 class="text-2xl font-bold">{{ title }}</h1>

      <span class="flex gap-2">
        <UIButton size="sm" icon-name="ic:outline-menu" :color="view === 'list' ? 'black' : 'gray'" @click="view = 'list'" />
        <UIButton size="sm" icon-name="ic:outline-grid-view" :color="view === 'grid' ? 'black' : 'gray'" @click="view = 'grid'" />
      </span>
    </summary>

    <div
      :class="{
        'flex flex-col gap-6': view === 'list',
        'grid grid-cols-3 gap-6': view === 'grid',
      }"
    >
      <slot />
    </div>
  </details>
</template>
