<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva('button', {
  variants: {
    intent: {
      primary: 'hover:outline-dashed',
    },
    size: {
      xs: 'px-4 py-2 text-[0.875rem] leading-[1.125rem] -outline-offset-1 hover:outline-2 active:scale-97 data-[has-icon="true"]:gap-2',
      sm: 'px-6 py-4 leading-[1.375rem] -outline-offset-1 hover:outline-2 active:scale-97 data-[has-icon="true"]:gap-2',
      md: 'px-6 py-4 text-[1.375rem] leading-[1.75rem] -outline-offset-2 hover:outline-3 active:scale-97 data-[has-icon="true"]:gap-2',
      lg: 'px-8 py-4 text-[2rem] leading-[2.75rem] -outline-offset-2 hover:outline-4 active:scale-97 data-[has-icon="true"]:gap-3',
    },
    color: {
      red: 'border-red-500 bg-red-500 text-white outline-red-600',
      blue: 'border-blue-500 bg-blue-500 text-white outline-blue-600',
      green: 'border-green-500 bg-green-500 text-black outline-green-600',
      yellow: 'border-black-500 bg-yellow-500 text-black outline-black',
      gray: 'border-gray-500 bg-gray-500 text-white outline-gray-600',
      black: 'border-black bg-black text-white !outline-none hover:bg-gray-200 hover:text-black',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75',
      false: 'cursor-pointer',
    },
  },
})

type ButtonProps = VariantProps<typeof button>

const icon = cva('icon shrink-0', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-6',
    },
  },
})

withDefaults(
  defineProps<{
    isLinkButton?: boolean
    intent?: ButtonProps['intent']
    size?: ButtonProps['size']
    color?: ButtonProps['color']
    iconName?: string
  }>(),
  {
    intent: 'primary',
    size: 'md',
    color: 'red',
    disabled: false,
    iconName: undefined,
  },
)
</script>

<template>
  <component
    :is="isLinkButton ? 'span' : 'button'"
    :disabled="typeof $attrs['disabled'] !== 'undefined'"
    :class="
      button({
        intent,
        size,
        color,
        disabled: typeof $attrs['disabled'] !== 'undefined',
      })
    "
    class="flex size-fit items-center justify-center rounded-full whitespace-nowrap"
    :data-has-icon="!!iconName"
  >
    <slot />
    <Icon
      v-if="!!iconName"
      :name="iconName"
      mode="svg"
      class="text-inherit [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current"
      :class="icon({ size })"
    />
  </component>
</template>
