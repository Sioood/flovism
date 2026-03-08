<script setup lang="ts">
import ButtonPage from './Button.vue'
import FormInputPage from './Form/Input.vue'
import FormRadioPage from './Form/Radio.vue'
import FormTextareaPage from './Form/Textarea.vue'
</script>

<template>
  <div class="flex flex-col">
    <ButtonPage :details-start-closed="true" />
    <FormInputPage :details-start-closed="true" />
    <FormTextareaPage :details-start-closed="true" />
    <FormRadioPage :details-start-closed="true" />
  </div>
</template>
