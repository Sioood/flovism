<script setup lang="ts">
import { Toast, Toaster } from '@ark-ui/vue/toast'
import { cva, type VariantProps } from 'class-variance-authority'

const toaster = useToast()

const toastRoot = cva(
  'toast group/toastRoot z-index-[var(--z-index)] will-change-transform-opacity relative flex h-[var(--height)] w-full min-w-xs translate-x-[var(--x)] translate-y-[var(--y)] scale-[var(--scale)] flex-col opacity-[var(--opacity)] transition-all duration-300 ease-in-out',
  {
    variants: {
      intent: {
        primary: 'outline-dashed',
      },
      size: {
        md: 'rounded-xl p-4 pr-20 text-base outline-2 -outline-offset-1',
      },
      color: {
        red: 'bg-red-500 text-white outline-red-600',
        blue: 'bg-blue-500 text-white outline-blue-600',
        green: 'bg-green-500 text-black outline-green-600',
        yellow: 'bg-yellow-500 text-black outline-black',
        gray: 'bg-gray-500 text-white outline-gray-600',
        black: 'bg-black text-white !outline-none hover:bg-gray-200 hover:text-black',
      },
    },
  },
)

type ToastRootProps = VariantProps<typeof toastRoot>

const toastTitle = cva('toastTitle', {
  variants: {
    size: {
      md: 'text-base',
    },
  },
})

const toastDescription = cva('toastDescription', {
  variants: {
    size: {
      md: 'text-sm font-light',
    },
  },
})

const toastCloseTrigger = cva('toastCloseTrigger absolute top-0 right-2 mt-2 inline-flex w-full justify-end opacity-0 group-hover/toastRoot:opacity-100', {
  variants: {
    size: {
      md: '',
    },
  },
})

withDefaults(
  defineProps<{
    color?: ToastRootProps['color']
    size?: ToastRootProps['size']
    intent?: ToastRootProps['intent']
  }>(),
  { color: 'gray', size: 'md', intent: 'primary' },
)

const colorTypes: Record<string, ToastRootProps['color']> = {
  loading: 'gray',
  error: 'red',
  success: 'green',
  warning: 'yellow',
  info: 'blue',
}

const iconMap = {
  loading: 'custom:refresh',
  success: 'custom:chevron',
  error: 'custom:cross',
  warning: 'custom:question-mark',
  info: 'custom:infos',
}
</script>

<template>
  <div v-if="toaster">
    <Teleport to="body">
      <Toaster v-slot="toast" :toaster="toaster">
        <Toast.Root :class="toastRoot({ color: colorTypes[toast.type as keyof typeof colorTypes], size, intent })">
          <Toast.Title :class="toastTitle({ size })">
            <Icon :name="iconMap[toast.type as keyof typeof iconMap]" class="size-3!" :class="{ 'animate-spin': toast.type === 'loading' }" />
            {{ toast.title }}
          </Toast.Title>
          <Toast.Description :class="toastDescription({ size })">{{ toast.description }}</Toast.Description>
          <Toast.CloseTrigger v-if="toast.closable" :class="toastCloseTrigger({ size })">
            <UIButton size="xs" :color="toast.type !== 'error' ? 'red' : 'gray'" intent="primary">
              <Icon name="custom:cross" />
            </UIButton>
          </Toast.CloseTrigger>
        </Toast.Root>
      </Toaster>
    </Teleport>
  </div>
</template>
