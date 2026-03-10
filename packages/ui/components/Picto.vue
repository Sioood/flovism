<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const picto = cva('picto', {
  variants: {
    intent: {
      primary: 'hover:outline-dashed',
    },
    size: {
      sm: 'p-2 -outline-offset-1 hover:outline-2',
      md: 'p-2.5 -outline-offset-2 hover:outline-3',
    },
    color: {
      red: 'border-red-500 bg-red-500 text-white outline-red-600',
      blue: 'border-blue-500 bg-blue-500 text-white outline-blue-600',
      green: 'border-green-500 bg-green-500 text-black outline-green-600',
      yellow: 'border-black-500 bg-yellow-500 text-black outline-black',
      gray: 'border-gray-500 bg-gray-500 text-red-500 outline-gray-600',
      black: 'border-black bg-black text-white !outline-none hover:bg-gray-200 hover:text-black',
    },
  },
})

type PictoProps = VariantProps<typeof picto>

const icon = cva('icon', {
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
    intent?: PictoProps['intent']
    size?: PictoProps['size']
    color?: PictoProps['color']
    iconName?: string
  }>(),
  {
    intent: 'primary',
    size: 'md',
    color: 'red',
    iconName: undefined,
  },
)
</script>

<template>
  <div
    :class="
      picto({
        intent,
        size,
        color,
      })
    "
    class="flex size-fit items-center justify-center rounded-full whitespace-nowrap"
  >
    <Icon
      v-if="!!iconName"
      :name="iconName"
      mode="svg"
      class="text-inherit [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current"
      :class="icon({ size })"
    />
  </div>
</template>
