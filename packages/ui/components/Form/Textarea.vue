<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const textarea = cva('textarea', {
  variants: {
    size: {
      sm: 'px-4 py-3 text-sub-sub',
      md: 'px-5 py-4 text-base',
    },
    color: {
      gray: 'bg-gray-200 text-black placeholder-gray-500',
    },
  },
})

type TextareaProps = VariantProps<typeof textarea>

const labelElement = cva('label', {
  variants: {
    size: {
      sm: 'text-sub-sub',
      md: 'text-base',
    },
  },
})

withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    modelValue?: string
    size?: TextareaProps['size']
    color?: TextareaProps['color']
    disabled?: boolean
    required?: boolean
    rows?: number
  }>(),
  {
    label: '',
    placeholder: '',
    modelValue: '',
    size: 'md',
    color: 'gray',
    disabled: false,
    required: false,
    rows: 4,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <fieldset class="flex flex-col">
    <label v-if="label" :class="labelElement({ size })">
      {{ label }}
      <span v-if="required">*</span>
    </label>
    <textarea
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :rows="rows"
      :class="
        textarea({
          size,
          color,
        })
      "
      class="w-full resize-none rounded-2xl outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </fieldset>
</template>
