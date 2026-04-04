<script setup lang="ts">
import ButtonPage from './Button.vue'
import DrawerPage from './Drawer.vue'
import FormFileUploadPage from './Form/FileUpload.vue'
import FormGenericPage from './Form/Generic.vue'
import FormInputPage from './Form/Input.vue'
import FormRadioPage from './Form/Radio.vue'
import FormSelectPage from './Form/Select.vue'
import FormTextareaPage from './Form/Textarea.vue'
import LabelPage from './Label.vue'
import PictoPage from './Picto.vue'
import ToasterPage from './Toaster.vue'
</script>

<template>
  <div class="flex flex-col">
    <ButtonPage :details-start-closed="true" />
    <DrawerPage :details-start-closed="true" />
    <FormFileUploadPage :details-start-closed="true" />
    <FormGenericPage :details-start-closed="true" />
    <FormInputPage :details-start-closed="true" />
    <FormRadioPage :details-start-closed="true" />
    <FormSelectPage :details-start-closed="true" />
    <FormTextareaPage :details-start-closed="true" />
    <LabelPage :details-start-closed="true" />
    <PictoPage :details-start-closed="true" />
    <ToasterPage :details-start-closed="true" />
  </div>
</template>
