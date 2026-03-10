<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const picto = cva('picto', {
  variants: {
    intent: {
      primary: 'hover:outline-dashed',
    },
    size: {
      sm: 'p-2 -outline-offset-1 hover:outline-2 active:scale-97',
      md: 'p-2.5 -outline-offset-2 hover:outline-3 active:scale-97',
    },
    color: {
      red: 'border-red-500 bg-red-500 text-white outline-red-600 [&_path]:!fill-white [&_path]:!stroke-white [&_svg]:!fill-white [&_svg]:!stroke-white',
      blue: 'border-blue-500 bg-blue-500 text-white outline-blue-600 [&_path]:!fill-white [&_path]:!stroke-white [&_svg]:!fill-white [&_svg]:!stroke-white',
      green: 'border-green-500 bg-green-500 text-black outline-green-600 [&_path]:!fill-black [&_path]:!stroke-black [&_svg]:!fill-black [&_svg]:!stroke-black',
      yellow:
        'border-black-500 outline-black-600 bg-yellow-500 text-black [&_path]:!fill-black [&_path]:!stroke-black [&_svg]:!fill-black [&_svg]:!stroke-black',
      gray: 'border-gray-500 bg-gray-500 text-white outline-gray-600 [&_path]:!fill-white [&_path]:!stroke-white [&_svg]:!fill-white [&_svg]:!stroke-white',
      black:
        'border-black bg-black text-white !outline-none hover:bg-gray-200 hover:text-black [&_path]:!fill-white [&_path]:!stroke-white hover:[&_path]:!fill-black hover:[&_path]:!stroke-black [&_svg]:!fill-white [&_svg]:!stroke-white hover:[&_svg]:!fill-black hover:[&_svg]:!stroke-black',
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
    <Icon v-if="!!iconName" :name="iconName" mode="svg" :class="icon({ size })" />
  </div>
</template>
