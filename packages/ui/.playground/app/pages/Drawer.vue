<script setup lang="ts">
import { ref } from 'vue'

import UIDrawer from '~ui/components/Drawer.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const drawerOpen = ref({
  bottom: false,
  top: false,
  left: false,
  right: false,
})

const drawerPropsSchema: PropDefinition[] = [
  { name: 'direction', type: 'string', default: 'bottom', options: ['bottom', 'top', 'left', 'right'] },
  { name: 'swipe-direction', type: 'string', default: 'down', options: ['down', 'up', 'left', 'right'] },
  { name: 'snap-points', type: 'array', default: '[0.3, 0.5, 1]' },
  { name: 'snap-point', type: 'number', default: 0.3 },
  { name: 'modal', type: 'boolean', default: true },
]
</script>

<template>
  <ComponentListViewer title="UIDrawer">
    <ComponentViewerWrapper
      v-for="direction in [
        { direction: 'bottom', swipeDirection: 'down' },
        { direction: 'top', swipeDirection: 'up' },
        { direction: 'left', swipeDirection: 'left' },
        { direction: 'right', swipeDirection: 'right' },
      ]"
      :key="direction.direction"
      :component="UIDrawer"
      :props-schema="drawerPropsSchema"
    >
      <template #preview>
        <UIDrawer
          v-model:open="drawerOpen[direction.direction as keyof typeof drawerOpen as keyof typeof drawerOpen]"
          :direction="direction.direction"
          :swipe-direction="direction.swipeDirection"
          :snap-points="[0.3, 0.5, 1]"
          :snap-point="0.3"
          :modal="true"
          @update:open="drawerOpen[direction.direction as keyof typeof drawerOpen as keyof typeof drawerOpen] = $event"
        >
          <template #trigger>
            <UIButton>Open UIDrawer {{ direction.direction }}</UIButton>
          </template>
        </UIDrawer>
      </template>
    </ComponentViewerWrapper>
  </ComponentListViewer>
</template>
