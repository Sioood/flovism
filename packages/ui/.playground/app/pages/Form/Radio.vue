<script setup lang="ts">
import UIFormRadio from '~ui/components/Form/Radio.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const formRadioPropsSchema: PropDefinition[] = [
  { name: 'label', type: 'string', required: false },
  { name: 'name', type: 'string', required: false },
  { name: 'value', type: 'string', required: false },
  { name: 'size', type: 'string', default: 'md', options: ['sm', 'md'] },
  { name: 'color', type: 'string', default: 'gray', options: ['gray', 'ghost'] },
  { name: 'type', type: 'string', default: 'radio', options: ['radio', 'checkbox'] },
  { name: 'disabled', type: 'boolean', required: false },
  { name: 'required', type: 'boolean', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Form Radio">
        <ComponentViewer
          :component="UIFormRadio"
          :initial-props="{ label: 'Radio', name: 'radio', value: 'radio', color: 'gray' }"
          :props-schema="formRadioPropsSchema"
          :default-component-background="false"
        />
        <ComponentViewer
          :component="UIFormRadio"
          :initial-props="{ label: 'Radio', name: 'radio', value: 'radio', color: 'gray', size: 'sm' }"
          :props-schema="formRadioPropsSchema"
          :default-component-background="false"
        />
        <ComponentViewer
          :component="UIFormRadio"
          :initial-props="{ label: 'Checkbox', name: 'checkbox', value: 'checkbox', type: 'checkbox' }"
          :props-schema="formRadioPropsSchema"
          :default-component-background="false"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
