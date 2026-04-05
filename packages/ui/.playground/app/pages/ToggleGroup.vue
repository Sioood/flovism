<script setup lang="ts">
import UIToggleGroup from '~ui/components/ToggleGroup.vue'

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
        <ComponentViewerWrapper :default-preview-background="false">
          <template #preview>
            <div class="flex flex-col gap-2">
              <UIToggleGroup v-model="modelValue" :options="options" class="join join-horizontal">
                <template v-for="option in options" :key="option.value" #[option.value]>
                  <UIPicto color="gray" :icon-name="option.icon" class="join-item" :state="modelValue?.includes(option.value) ? 'active' : 'inactive'" />
                </template>
              </UIToggleGroup>
            </div>
          </template>
        </ComponentViewerWrapper>
      </ComponentListViewer>
    </div>
  </div>
</template>
