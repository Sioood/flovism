<script setup lang="ts">
const props = defineProps<{ to: string; forceExternal?: boolean }>()

const isExternalLink = computed(() => typeof props.to === 'string' && props.to.startsWith('http'))
</script>

<template>
  <a v-if="props.forceExternal || isExternalLink" :href="props.to" target="_blank">
    <slot is-link-button />
  </a>

  <NuxtLink v-else :to="props.to">
    <slot :is-link-button="true" />
  </NuxtLink>
</template>
