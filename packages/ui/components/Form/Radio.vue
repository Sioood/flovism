<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const radio = cva('radio', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-6',
    },
    color: {
      gray: 'border-4 border-gray-200 outline-2 -outline-offset-2 checked:bg-black',
      ghost: 'border-4 border-gray-200 outline-2 -outline-offset-2 checked:bg-black',
    },
    type: {
      radio: 'rounded-full',
      checkbox: 'rounded',
    },
  },
})

type RadioProps = VariantProps<typeof radio>

const labelElement = cva('label', {
  variants: {
    color: {
      gray: 'bg-gray-200 text-black',
      ghost: 'bg-transparent text-black',
    },
    size: {
      sm: 'px-4 py-2 text-sub-sub',
      md: 'px-5 py-4 text-base',
    },
  },
})

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    modelValue?: string | boolean
    value?: string
    size?: RadioProps['size']
    color?: RadioProps['color']
    disabled?: boolean
    required?: boolean
    name?: string
    type?: RadioProps['type']
  }>(),
  {
    id: '',
    label: '',
    name: '',
    value: '',
    modelValue: '',
    size: 'md',
    color: 'gray',
    disabled: false,
    required: false,
    type: 'radio',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | boolean]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.type === 'checkbox') {
    emit('update:modelValue', target.checked)
  } else {
    emit('update:modelValue', target.value)
  }
}
</script>

<template>
  <fieldset class="flex items-center gap-3">
    <label :class="labelElement({ size, color })" class="flex cursor-pointer items-center gap-3 rounded-full">
      <input
        :id="id || `${name}-${value}`"
        :type="type!"
        :name="name"
        :value="value"
        :checked="type === 'checkbox' ? !!modelValue : modelValue === value"
        :disabled="disabled"
        :required="required"
        :class="
          radio({
            size,
            color,
            type,
          })
        "
        class="appearance-none"
        @change="handleChange"
      />
      <span v-if="label" class="select-none">{{ label }}</span>
      <span v-if="required">*</span>
    </label>
  </fieldset>
</template>
