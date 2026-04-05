<script setup lang="ts" generic="T extends { value: string; label: string }">
import { ToggleGroup } from '@ark-ui/vue/toggle-group'

withDefaults(
  defineProps<{
    modelValue: string[]
    multiple?: boolean
    options?: T[]
  }>(),
  {
    multiple: false,
    options: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()
</script>

<template>
  <ToggleGroup.Root :model-value="modelValue" multiple @update:model-value="emit('update:modelValue', $event)">
    <template v-for="option in options" :key="option.value">
      <ToggleGroup.Item :value="option.value" class="cursor-pointer">
        <slot :name="option.value" :option="option" :selected="modelValue?.includes(option.value)" />
      </ToggleGroup.Item>
    </template>
  </ToggleGroup.Root>
</template>
