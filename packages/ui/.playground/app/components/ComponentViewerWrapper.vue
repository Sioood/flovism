<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    defaultPreviewBackground?: boolean
    emptyLabel?: string
  }>(),
  {
    title: 'Preview',
    defaultPreviewBackground: true,
    emptyLabel: 'Nothing to preview',
  },
)

const previewBackground = ref(props.defaultPreviewBackground)
</script>

<template>
  <div class="rounded-lg border border-gray-200 p-4">
    <section class="mb-4">
      <h3 class="mb-2 font-medium text-gray-500">{{ title }}</h3>
      <div class="relative flex min-h-10 items-center justify-center rounded border border-gray-200 p-6" :class="{ 'bg-gray-200': previewBackground }">
        <button class="absolute top-2 right-2 cursor-pointer rounded-md p-1 hover:bg-gray-300" @click="previewBackground = !previewBackground">
          <Icon name="ic:baseline-lightbulb" class="size-3 text-gray-400" mode="svg" />
        </button>
        <slot name="preview">
          <span class="text-gray-500">{{ emptyLabel }}</span>
        </slot>
      </div>
    </section>

    <slot />
  </div>
</template>
