<script setup lang="ts">
import ButtonPage from './Button.vue'
import FormFileUploadPage from './Form/FileUpload.vue'
import FormInputPage from './Form/Input.vue'
import FormRadioPage from './Form/Radio.vue'
import FormSelectPage from './Form/Select.vue'
import FormTextareaPage from './Form/Textarea.vue'
import LabelPage from './Label.vue'
import PictoPage from './Picto.vue'
</script>

<template>
  <div class="flex flex-col">
    <ButtonPage :details-start-closed="true" />
    <FormFileUploadPage :details-start-closed="true" />
    <FormInputPage :details-start-closed="true" />
    <FormRadioPage :details-start-closed="true" />
    <FormSelectPage :details-start-closed="true" />
    <FormTextareaPage :details-start-closed="true" />
    <LabelPage :details-start-closed="true" />
    <PictoPage :details-start-closed="true" />
  </div>
</template>
