<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

const { t } = useI18n()

const [DefineSidebarButton, ReuseSidebarButton] = createReusableTemplate()

interface Action {
  iconName?: string
  label: string
  to?: string
  action?: () => void
}

const actions: Action[] = [
  {
    label: t('dashboard'),
    to: '/',
    action: () => {
      console.log('Dashboard')
    },
  },
  {
    label: 'Projects',
    to: '/projects',
    action: () => {
      console.log('Projects')
    },
  },
]
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <DefineSidebarButton v-slot="{ iconName, label, action }">
      <UIButton size="sm" color="gray" :icon-name="iconName" :label="label" :action="action" class="w-full">
        {{ label }}
      </UIButton>
    </DefineSidebarButton>

    <div v-for="action in actions" :key="action.label">
      <UILink v-if="action.to" :to="action.to">
        <ReuseSidebarButton :icon-name="action.iconName" :label="action.label" :action="action.action" />
      </UILink>
      <ReuseSidebarButton v-else :icon-name="action.iconName" :label="action.label" :action="action.action" />
    </div>
  </div>
</template>
