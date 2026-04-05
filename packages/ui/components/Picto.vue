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
      red: 'border-red-500 bg-red-500 text-white outline-red-600 data-[state=active]:bg-red-600 data-[state=active]:outline-red-700 data-[state=disabled]:bg-red-300 data-[state=disabled]:outline-red-400',
      blue: 'border-blue-500 bg-blue-500 text-white outline-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:outline-blue-700 data-[state=disabled]:bg-blue-300 data-[state=disabled]:outline-blue-400',
      green:
        'border-green-500 bg-green-500 text-black outline-green-600 data-[state=active]:bg-green-600 data-[state=active]:outline-green-700 data-[state=disabled]:bg-green-300 data-[state=disabled]:outline-green-400',
      yellow:
        'border-black-500 bg-yellow-500 text-black outline-black data-[state=active]:bg-yellow-600 data-[state=active]:outline-yellow-700 data-[state=disabled]:bg-yellow-300 data-[state=disabled]:outline-yellow-400',
      gray: 'border-gray-200 bg-gray-200 text-black outline-gray-300 data-[state=active]:bg-gray-300 data-[state=active]:outline-gray-400 data-[state=disabled]:bg-gray-100 data-[state=disabled]:outline-gray-200',
      black:
        'border-black bg-black text-white !outline-none hover:bg-gray-200 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=disabled]:bg-gray-300 data-[state=disabled]:text-gray-500',
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
    iconName?: CustomIconName | string
    state?: 'active' | 'inactive' | 'disabled'
  }>(),
  {
    intent: 'primary',
    size: 'md',
    color: 'red',
    iconName: undefined,
    state: 'inactive',
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
    :data-state="state"
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
