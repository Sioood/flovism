<script setup lang="ts">
import UIFormTextarea from '~ui/components/Form/Textarea.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const formTextareaPropsSchema: PropDefinition[] = [
  { name: 'label', type: 'string', required: false },
  { name: 'placeholder', type: 'string', required: false },
  { name: 'size', type: 'string', default: 'md', options: ['sm', 'md'] },
  { name: 'color', type: 'string', default: 'gray', options: ['gray'] },
  { name: 'disabled', type: 'boolean', required: false },
  { name: 'required', type: 'boolean', required: false },
  { name: 'rows', type: 'number', default: 4, required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Form Textarea">
        <ComponentViewer
          :component="UIFormTextarea"
          :initial-props="{ label: 'Message', placeholder: 'Enter your message here...', rows: 6, required: true }"
          :props-schema="formTextareaPropsSchema"
          :default-component-background="false"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
