<script setup lang="ts">
import UIFormInput from '~ui/components/Form/Input.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const formInputPropsSchema: PropDefinition[] = [
  { name: 'label', type: 'string', required: false },
  { name: 'placeholder', type: 'string', required: false },
  { name: 'size', type: 'string', default: 'md', options: ['sm', 'md'] },
  { name: 'color', type: 'string', default: 'gray', options: ['gray'] },
  { name: 'type', type: 'string', default: 'text', required: false },
  { name: 'disabled', type: 'boolean', required: false },
  { name: 'required', type: 'boolean', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Form Input">
        <ComponentViewer
          :component="UIFormInput"
          :initial-props="{ placeholder: 'placeholder' }"
          :props-schema="formInputPropsSchema"
          :default-component-background="false"
        />
        <ComponentViewer
          :component="UIFormInput"
          :initial-props="{ label: 'label', placeholder: 'placeholder' }"
          :props-schema="formInputPropsSchema"
          :default-component-background="false"
        />
        <ComponentViewer
          :component="UIFormInput"
          :initial-props="{ label: 'label', placeholder: 'placeholder', required: true }"
          :props-schema="formInputPropsSchema"
          :default-component-background="false"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
