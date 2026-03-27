<script setup lang="ts">
import UIFormFileUpload from '~ui/components/Form/FileUpload.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const formFileUploadPropsSchema: PropDefinition[] = [
  { name: 'label', type: 'string', required: false },
  { name: 'placeholder', type: 'string', required: false },
  { name: 'size', type: 'string', default: 'md', options: ['md'] },
  { name: 'color', type: 'string', default: 'gray', options: ['gray'] },
  { name: 'name', type: 'string', required: false },
  { name: 'accept', type: 'string', required: false },
  { name: 'limit', type: 'number', default: 1 },
  { name: 'minFileSize', type: 'number', required: false },
  { name: 'maxFileSize', type: 'number', required: false },
  { name: 'multiple', type: 'boolean', required: false },
  { name: 'disabled', type: 'boolean', required: false },
  { name: 'required', type: 'boolean', required: false },
  { name: 'browseOnClick', type: 'boolean', required: false },
  { name: 'showSelectedFiles', type: 'boolean', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Form FileUpload">
        <ComponentViewer
          :component="UIFormFileUpload"
          :initial-props="{ placeholder: 'Cliquez ici / déposer le fichier ici' }"
          :props-schema="formFileUploadPropsSchema"
          :default-preview-background="false"
        />

        <ComponentViewer
          :component="UIFormFileUpload"
          :initial-props="{
            label: 'Pièce jointe',
            placeholder: 'Importer votre document',
            accept: '.pdf,.doc,.docx',
            required: true,
          }"
          :props-schema="formFileUploadPropsSchema"
          :default-preview-background="false"
        />

        <ComponentViewer
          :component="UIFormFileUpload"
          :initial-props="{
            label: 'Images',
            placeholder: 'Déposez vos images',
            accept: 'image/*',
            multiple: true,
            limit: 5,
            maxFileSize: 5000000,
          }"
          :props-schema="formFileUploadPropsSchema"
          :default-preview-background="false"
        />
      </ComponentListViewer>
    </div>
  </div>
</template>
