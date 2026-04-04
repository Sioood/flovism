<script setup lang="ts">
import { Drawer, type DrawerRootBaseProps } from '@ark-ui/vue/drawer'
import { cva, type VariantProps } from 'class-variance-authority'

const drawerRootPositioner = cva('drawerRootPositioner inset-0 z-9999 flex', {
  variants: {
    position: {
      fixed: 'fixed',
    },
    direction: {
      left: 'items-stretch justify-start',
      right: 'items-stretch justify-end',
      top: 'items-start justify-center',
      bottom: 'items-end justify-center',
    },
  },
})

/* Motion lives on an inner node so animations match [data-part=content][data-state] on the Ark root. */
const drawerContentRoot = cva('drawerContentRoot flex size-full min-h-0 flex-col outline-none')

const drawerContentMotion = cva('drawerContentMotion flex min-h-0 min-w-0 shadow-xl', {
  variants: {
    direction: {
      left: 'size-full max-h-none flex-row-reverse rounded-r-2xl',
      right: 'size-full max-h-none flex-row rounded-l-2xl',
      top: 'size-full flex-col-reverse rounded-b-2xl',
      bottom: 'size-full flex-col rounded-t-2xl',
    },
    background: {
      gray: 'bg-gray-200',
    },
  },
})

const drawerGrabber = cva('drawerGrabber flex flex-shrink-0 cursor-grab touch-none items-center justify-center px-3 py-2 select-none', {
  variants: {
    direction: {
      left: 'w-content',
      bottom: 'w-full',
      top: 'w-full',
      right: 'w-content',
    },
  },
})

const drawerGrabberIndicator = cva('drawerGrabberIndicator rounded-full bg-gray-300', {
  variants: {
    direction: {
      left: 'h-10 w-1',
      bottom: 'h-1 w-10',
      top: 'h-1 w-10',
      right: 'h-10 w-1',
    },
  },
})

const contentWrapper = cva('contentWrapper flex size-full gap-2', {
  variants: {
    direction: {
      left: 'flex-col',
      right: 'flex-col',
      top: 'flex-col-reverse',
      bottom: 'flex-col',
    },
    scrollableContent: {
      true: 'min-h-0 flex-1 overflow-y-scroll overscroll-y-contain',
    },
  },
})

const contentCloseTriggerWrapper = cva('contentCloseTriggerWrapper sticky top-0 flex p-2', {
  variants: {
    direction: {
      left: 'justify-end',
      right: 'justify-start',
      top: 'justify-end',
      bottom: 'justify-end',
    },
  },
})

type DrawerContentVariantProps = VariantProps<typeof drawerContentMotion>

const props = withDefaults(
  defineProps<
    DrawerRootBaseProps & {
      direction?: 'left' | 'right' | 'top' | 'bottom'
      position?: 'fixed'
      maxWidth?: string
      maxHeight?: string
      background?: DrawerContentVariantProps['background']
      defaultTriggerHandling?: boolean
      draggable?: boolean
      scrollableContent?: boolean
    }
  >(),
  {
    direction: 'bottom',
    position: 'fixed',
    modal: true,
    closeOnEscape: true,
    closeOnInteractOutside: true,
    showGrabber: false,
    maxWidth: undefined,
    maxHeight: undefined,
    defaultSnapPoint: 1,
    background: 'gray',
    defaultTriggerHandling: true,
    draggable: false,
    scrollableContent: true,
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const computedMaxWidth = computed(() => {
  if (props.maxWidth) return props.maxWidth
  return ['left', 'right'].includes(props.direction) ? '400px' : '100%'
})

const computedMaxHeight = computed(() => {
  if (props.maxHeight) return props.maxHeight
  return ['top', 'bottom'].includes(props.direction) ? '96svh' : '100%'
})

const contentCloseTriggerWrapperRef = ref<HTMLElement | null>(null)
</script>

<template>
  <Drawer.Root v-bind="$props" @open-change="(e) => emit('update:open', e.open)">
    <div @click="defaultTriggerHandling ? emit('update:open', !open) : null">
      <slot name="trigger" />
    </div>

    <Teleport to="body">
      <Drawer.Backdrop
        v-if="modal"
        class="fixed inset-0 z-9999 bg-black/50 data-[state=closed]:animate-[drawer-fade-out_0.2s_ease-out] data-[state=open]:animate-[drawer-fade-in_0.2s_ease-out] data-[state=open]:opacity-100"
      />
      <Drawer.Positioner :class="drawerRootPositioner({ position, direction })">
        <Drawer.Content :class="drawerContentRoot()" :style="{ maxWidth: computedMaxWidth, maxHeight: computedMaxHeight }">
          <div :class="drawerContentMotion({ direction, background })" :data-drawer-direction="direction">
            <Drawer.Grabber :class="drawerGrabber({ direction })">
              <Drawer.GrabberIndicator :class="drawerGrabberIndicator({ direction })" />
            </Drawer.Grabber>

            <div :class="contentWrapper({ direction, scrollableContent })">
              <slot name="header" />

              <div ref="contentCloseTriggerWrapperRef" :class="contentCloseTriggerWrapper({ direction })" />

              <slot name="header" />

              <div class="flex size-full min-h-0 shrink-0 flex-col gap-4">
                <slot />
              </div>

              <slot name="footer" />

              <Teleport v-if="contentCloseTriggerWrapperRef" :to="contentCloseTriggerWrapperRef">
                <Drawer.CloseTrigger>
                  <UIButton size="sm" icon-name="custom:cross" />
                </Drawer.CloseTrigger>
              </Teleport>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Positioner>
    </Teleport>
  </Drawer.Root>
</template>

<style>
@keyframes drawer-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes drawer-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/*
 * Motion is on an inner element; Ark keeps snap/drag on the root via --drawer-translate-* + transform.
 * Those variables inherit — keyframes must *not* use them on the inner layer or translation is doubled.
 */
@keyframes drawer-slide-in-bottom {
  from {
    transform: translate3d(0, 100vh, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes drawer-slide-out-bottom {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100vh, 0);
  }
}

@keyframes drawer-slide-in-top {
  from {
    transform: translate3d(0, -100vh, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes drawer-slide-out-top {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -100vh, 0);
  }
}

@keyframes drawer-slide-in-left {
  from {
    transform: translate3d(-100vw, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes drawer-slide-out-left {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-100vw, 0, 0);
  }
}

@keyframes drawer-slide-in-right {
  from {
    transform: translate3d(100vw, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes drawer-slide-out-right {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(100vw, 0, 0);
  }
}

[data-scope='drawer'][data-part='content'][data-state='open'] .drawerContentMotion[data-drawer-direction='bottom'] {
  animation: drawer-slide-in-bottom 0.2s ease-out 10ms both;
}

[data-scope='drawer'][data-part='content'][data-state='closed'] .drawerContentMotion[data-drawer-direction='bottom'] {
  animation: drawer-slide-out-bottom 0.2s ease-out forwards;
}

[data-scope='drawer'][data-part='content'][data-state='open'] .drawerContentMotion[data-drawer-direction='top'] {
  animation: drawer-slide-in-top 0.2s ease-out 10ms both;
}

[data-scope='drawer'][data-part='content'][data-state='closed'] .drawerContentMotion[data-drawer-direction='top'] {
  animation: drawer-slide-out-top 0.2s ease-out forwards;
}

[data-scope='drawer'][data-part='content'][data-state='open'] .drawerContentMotion[data-drawer-direction='left'] {
  animation: drawer-slide-in-left 0.2s ease-out 10ms both;
}

[data-scope='drawer'][data-part='content'][data-state='closed'] .drawerContentMotion[data-drawer-direction='left'] {
  animation: drawer-slide-out-left 0.2s ease-out forwards;
}

[data-scope='drawer'][data-part='content'][data-state='open'] .drawerContentMotion[data-drawer-direction='right'] {
  animation: drawer-slide-in-right 0.2s ease-out 10ms both;
}

[data-scope='drawer'][data-part='content'][data-state='closed'] .drawerContentMotion[data-drawer-direction='right'] {
  animation: drawer-slide-out-right 0.2s ease-out forwards;
}
</style>
