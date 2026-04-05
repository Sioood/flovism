<script setup lang="ts">
import UIToggleGroup from '~ui/components/ToggleGroup.vue'

import type { PropDefinition } from '~/components/ComponentViewer.vue'

const toggleGroupPropsSchema: PropDefinition[] = [
  { name: 'options', type: 'array', required: false },
  { name: 'multiple', type: 'boolean', required: false },
  { name: 'modelValue', type: 'array', required: false },
]

const options = [
  { value: 'feed', label: 'Feed', icon: 'custom:compo-project-feed' },
  { value: 'grid', label: 'Grid', icon: 'custom:compo-project-grid' },
  { value: 'list', label: 'List', icon: 'custom:compo-project-list' },
]

const modelValue = ref(['feed'])
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="ToggleGroup">
        <ComponentViewer
          :component="UIToggleGroup"
          :initial-props="{ options, modelValue }"
          :props-schema="toggleGroupPropsSchema"
          :default-preview-background="false"
          @update:props="
            (p) => {
              modelValue = p.modelValue
            }
          "
        >
          <template #override="{ props }">
            <UIToggleGroup
              v-bind="props"
              class="join join-horizontal"
              @update:model-value="
                (v: string[]) => {
                  modelValue = v
                }
              "
            >
              <template v-for="option in props.options" :key="option.value" #[option.value]>
                <UIPicto color="gray" :icon-name="option.icon" class="join-item" :state="props.modelValue?.includes(option.value) ? 'active' : 'inactive'" />
              </template>
            </UIToggleGroup>
          </template>
        </ComponentViewer>
      </ComponentListViewer>
    </div>
  </div>
</template>
