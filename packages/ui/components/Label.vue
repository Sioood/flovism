<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

import type { CustomIconName } from '~ui/utils/icon'

const label = cva('label', {
  variants: {
    size: {
      md: 'px-4 py-2 leading-[1.375rem] -outline-offset-1 active:scale-97 data-[has-icon="true"]:gap-2',
    },
    color: {
      gray: 'bg-gray-500 text-white outline-gray-600 hover:outline-2 hover:outline-dashed data-[state="active"]:bg-yellow-500 data-[state="active"]:text-black data-[state="active"]:outline-2 data-[state="active"]:outline-black data-[state="active"]:outline-dashed data-[state="active"]:hover:outline-none',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75',
      false: 'cursor-pointer',
    },
  },
})

type LabelProps = VariantProps<typeof label>

const icon = cva('icon shrink-0', {
  variants: {
    size: {
      md: 'size-2',
    },
  },
})

withDefaults(
  defineProps<{
    size?: LabelProps['size']
    color?: LabelProps['color']
    state?: 'default' | 'active'
    iconName?: CustomIconName | string
  }>(),
  {
    intent: 'primary',
    size: 'md',
    color: 'gray',
    state: 'default',
    disabled: false,
    iconName: undefined,
  },
)
</script>

<template>
  <span
    :disabled="typeof $attrs['disabled'] !== 'undefined'"
    :class="
      label({
        size,
        color,
        disabled: typeof $attrs['disabled'] !== 'undefined',
      })
    "
    class="flex size-fit items-center justify-center rounded-full whitespace-nowrap"
    :data-has-icon="!!iconName"
    :data-state="state"
  >
    <slot />
    <Icon
      v-if="!!iconName"
      :name="iconName"
      mode="svg"
      class="text-inherit [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current"
      :class="icon({ size })"
    />
  </span>
</template>
