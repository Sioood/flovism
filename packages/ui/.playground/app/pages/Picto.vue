<script setup lang="ts">
import UIPicto from '~ui/components/Picto.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const iconPaths = import.meta.glob('~ui/assets/icons/**/*.svg', { eager: false })

const iconsNames = computed(() => Object.keys(iconPaths).map((icon) => `custom:${icon.split('/').pop()?.split('.').shift()}`))

const pictoPropsSchema: PropDefinition[] = [
  { name: 'intent', type: 'string', default: 'primary', options: ['primary'] },
  { name: 'size', type: 'string', default: 'md', options: ['sm', 'md'] },
  { name: 'color', type: 'string', default: 'red', options: ['red', 'blue', 'green', 'yellow', 'gray', 'black'] },
  { name: 'iconName', type: 'string', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Picto">
        <ComponentViewer
          v-for="color in ['red', 'blue', 'green', 'yellow', 'gray', 'black']"
          :key="color"
          :component="UIPicto"
          :initial-props="{ intent: 'primary', size: 'md', color, iconName: 'custom:plus' }"
          :props-schema="pictoPropsSchema"
        />
      </ComponentListViewer>

      <ComponentListViewer title="Join">
        <ComponentViewerWrapper
          :component="UIPicto"
          :initial-props="{ intent: 'primary', size: 'md', color: 'red', iconName: 'custom:plus' }"
          :props-schema="pictoPropsSchema"
        >
          <template #preview>
            <div class="join join-horizontal">
              <UIPicto class="join-item" color="red" icon-name="custom:plus" />
              <UIPicto class="join-item" color="blue" icon-name="custom:plus" />
            </div>
          </template>
        </ComponentViewerWrapper>

        <ComponentViewerWrapper
          :component="UIPicto"
          :initial-props="{ intent: 'primary', size: 'md', color: 'red', iconName: 'custom:plus' }"
          :props-schema="pictoPropsSchema"
        >
          <template #preview>
            <div class="join join-horizontal">
              <UIPicto class="join-item" color="red" icon-name="custom:plus" />
              <UIPicto class="join-item" color="yellow" icon-name="custom:plus" />
              <UIPicto class="join-item" color="green" icon-name="custom:plus" />
            </div>
          </template>
        </ComponentViewerWrapper>
      </ComponentListViewer>

      <ComponentListViewer title="Icons">
        <ComponentViewer
          v-for="icon in iconsNames"
          :key="icon"
          :component="UIPicto"
          :initial-props="{ intent: 'primary', size: 'md', color: 'gray', iconName: icon }"
          :props-schema="pictoPropsSchema"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
