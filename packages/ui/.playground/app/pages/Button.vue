<script setup lang="ts">
import UIButton from '~ui/components/Button.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const buttonPropsSchema: PropDefinition[] = [
  { name: 'intent', type: 'string', default: 'primary', options: ['primary'] },
  { name: 'size', type: 'string', default: 'md', options: ['sm', 'md', 'lg'] },
  { name: 'color', type: 'string', default: 'red', options: ['red', 'blue', 'green', 'yellow', 'gray', 'black'] },
  { name: 'iconName', type: 'string', required: false },
  { name: 'isLinkButton', type: 'boolean', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Button">
        <ComponentViewer
          v-for="color in ['red', 'blue', 'green', 'yellow', 'gray', 'black']"
          :key="color"
          :component="UIButton"
          :initial-props="{ intent: 'primary', size: 'md', color, iconName: 'custom:plus' }"
          :props-schema="buttonPropsSchema"
        >
          Primary
        </ComponentViewer>
        <ComponentViewer
          v-for="color in ['red', 'blue', 'green', 'yellow', 'gray', 'black']"
          :key="color"
          :component="UIButton"
          :initial-props="{ intent: 'primary', size: 'md', color, iconName: 'custom:plus' }"
          :props-schema="buttonPropsSchema"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
