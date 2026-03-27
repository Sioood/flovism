<script setup lang="ts">
import UILabel from '~ui/components/Label.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const labelPropsSchema: PropDefinition[] = [
  { name: 'state', type: 'string', default: 'default', options: ['default', 'active'] },
  { name: 'color', type: 'string', default: 'gray', options: ['gray'] },
  { name: 'iconName', type: 'string', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Label">
        <ComponentViewer
          v-for="state in ['default', 'active']"
          :key="state"
          :component="UILabel"
          :initial-props="{ state, iconName: 'custom:plus' }"
          :props-schema="labelPropsSchema"
        >
          Primary
        </ComponentViewer>
      </ComponentListViewer>
    </div>
  </div>
</template>
