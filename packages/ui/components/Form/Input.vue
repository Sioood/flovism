<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const input = cva('input', {
  variants: {
    size: {
      sm: 'px-4 py-3 text-[0.875rem]',
      md: 'px-5 py-4 text-[1.375rem]',
    },
    color: {
      gray: 'bg-gray-200 text-black placeholder-gray-500',
    },
  },
})

type InputProps = VariantProps<typeof input>

const labelElement = cva('label', {
  variants: {
    size: {
      sm: 'text-[0.875rem]',
      md: 'text-[1.375rem]',
    },
  },
})

withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    modelValue?: string
    size?: InputProps['size']
    color?: InputProps['color']
    type?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    modelValue: '',
    size: 'md',
    color: 'gray',
    type: 'text',
    disabled: false,
    required: false,
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
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :class="
        input({
          size,
          color,
        })
      "
      class="w-full rounded-full outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </fieldset>
</template>
