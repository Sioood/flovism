<script setup lang="ts">
import UIFormSelect from '~ui/components/Form/Select.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const formSelectPropsSchema: PropDefinition[] = [
  { name: 'label', type: 'string', required: false },
  { name: 'placeholder', type: 'string', required: false },
  { name: 'size', type: 'string', default: 'md', options: ['md'] },
  { name: 'color', type: 'string', default: 'gray', options: ['gray', 'darkerGray'] },
  { name: 'multiple', type: 'boolean', required: false },
  { name: 'name', type: 'string', required: false },
  { name: 'autocomplete', type: 'string', required: false },
  { name: 'disabled', type: 'boolean', required: false },
  { name: 'required', type: 'boolean', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Form Select">
        <ComponentViewer
          :component="UIFormSelect"
          :initial-props="{
            placeholder: 'Choisir une typographie',
            options: ['Agamba', 'Miame', 'Entraeme'],
          }"
          :props-schema="formSelectPropsSchema"
          :default-preview-background="false"
        />
        <ComponentViewer
          :component="UIFormSelect"
          :initial-props="{
            label: 'Typographie',
            placeholder: 'Choisir une typographie',
            required: true,
            color: 'darkerGray',
            options: [
              { label: 'Agamba', value: 'agamba' },
              { label: 'Miame', value: 'miame' },
              { label: 'Entraeme', value: 'entraeme' },
            ],
          }"
          :props-schema="formSelectPropsSchema"
          :default-preview-background="false"
        />
        <ComponentViewer
          :component="UIFormSelect"
          :initial-props="{
            label: 'Typographies',
            placeholder: 'Choisir une typographie',
            required: true,
            color: 'darkerGray',
            multiple: true,
            options: [
              {
                label: 'Sans-serif',
                options: [
                  { label: 'Agamba', value: 'agamba' },
                  { label: 'Entraeme', value: 'entraeme' },
                ],
              },
              {
                label: 'Serif',
                options: [{ label: 'Miame', value: 'miame' }],
              },
            ],
          }"
          :props-schema="formSelectPropsSchema"
          :default-preview-background="false"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
