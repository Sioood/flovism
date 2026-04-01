<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const input = cva('input', {
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

type InputProps = VariantProps<typeof input>

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
    error?: string | string[]
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
    error: () => [],
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
  <fieldset class="flex w-full flex-col">
    <label v-if="label" :class="labelElement({ size })">
      {{ $t(label) }}
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
    <template v-if="Array.isArray(error) ? error.length > 0 : !!error">
      <p v-for="(message, index) in Array.isArray(error) ? error : [error]" :key="`${index}-${message}`" class="mt-1 text-sm text-red-700">
        {{ message }}
      </p>
    </template>
  </fieldset>
</template>
