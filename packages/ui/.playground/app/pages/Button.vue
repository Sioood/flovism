<script setup lang="ts">
import UIButton from '~ui/components/Button.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const buttonPropsSchema: PropDefinition[] = [
  { name: 'intent', type: 'string', default: 'primary', options: ['primary'] },
  { name: 'size', type: 'string', default: 'md', options: ['xs', 'sm', 'md', 'lg'] },
  { name: 'color', type: 'string', default: 'red', options: ['red', 'blue', 'green', 'yellow', 'gray', 'black'] },
  { name: 'iconName', type: 'string', required: false },
  { name: 'isLinkButton', type: 'boolean', required: false },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Button">
        <ComponentViewer
          v-for="color in ['red', 'blue', 'green', 'yellow', 'gray', 'black']"
          :key="color"
          :component="UIButton"
          :initial-props="{ intent: 'primary', size: 'md', color, iconName: 'custom:plus' }"
          :props-schema="buttonPropsSchema"
        >
          Primary
        </ComponentViewer>
        <ComponentViewer
          v-for="color in ['red', 'blue', 'green', 'yellow', 'gray', 'black']"
          :key="color"
          :component="UIButton"
          :initial-props="{ intent: 'primary', size: 'md', color, iconName: 'custom:plus' }"
          :props-schema="buttonPropsSchema"
        />
      </ComponentListViewer>

      <ComponentListViewer title="Join">
        <ComponentViewer
          :component="UIButton"
          :initial-props="{ intent: 'primary', size: 'md', iconName: 'custom:plus' }"
          :props-schema="buttonPropsSchema"
          :default-preview-background="false"
        >
          <template #override="{ props }">
            <div class="join join-horizontal">
              <UIButton class="join-item" color="red" v-bind="props"> Left </UIButton>
              <UIButton class="join-item" color="blue" v-bind="props"> Right </UIButton>
            </div>
          </template>
        </ComponentViewer>

        <ComponentViewer
          :component="UIButton"
          :initial-props="{ intent: 'primary', size: 'md', iconName: 'custom:plus' }"
          :props-schema="buttonPropsSchema"
          :default-preview-background="false"
        >
          <template #override="{ props }">
            <div class="join join-horizontal">
              <UIButton class="join-item" color="red" v-bind="props"> First </UIButton>
              <UIButton class="join-item" color="yellow" v-bind="props"> Middle </UIButton>
              <UIButton class="join-item" color="green" v-bind="props"> Last </UIButton>
            </div>
          </template>
        </ComponentViewer>
      </ComponentListViewer>
    </div>
  </div>
</template>
