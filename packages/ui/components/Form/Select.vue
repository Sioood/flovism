<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import {
  SelectContent,
  type SelectContentProps,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  type SelectPortalProps,
  SelectRoot,
  type SelectRootProps,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  useForwardPropsEmits,
} from 'reka-ui'

const { t } = useI18n()

type SelectOptionItem = {
  label: string
  value: string
  disabled?: boolean
}

type SelectOptionGroup = {
  label: string
  options: Array<SelectOptionItem | string>
}

type SelectOption = SelectOptionItem | SelectOptionGroup | string
type ModelValue = string | string[]

const trigger = cva('select-trigger', {
  variants: {
    size: {
      md: 'px-4 py-2 text-sub',
    },
    color: {
      gray: 'bg-gray-200 text-black data-[placeholder]:text-gray-500',
      darkerGray: 'bg-gray-300 text-black data-[placeholder]:text-gray-600',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75',
      false: 'cursor-pointer',
    },
  },
})

const content = cva('select-content', {
  variants: {
    size: {
      md: 'text-sub',
    },
    color: {
      gray: 'bg-gray-200 text-black',
      darkerGray: 'bg-gray-300 text-black',
    },
  },
})

const item = cva('select-item', {
  variants: {
    size: {
      md: 'px-1 py-2',
    },
    color: {
      gray: 'px-4 py-2 text-sub data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-gray-300 data-[state=checked]:bg-gray-300',
      darkerGray:
        'px-4 py-2 text-sub data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-gray-400 data-[state=checked]:bg-gray-400',
    },
  },
})

type SelectProps = VariantProps<typeof trigger>

const labelElement = cva('label', {
  variants: {
    size: {
      md: 'text-base',
    },
  },
})

const props = withDefaults(
  defineProps<
    {
      label?: string
      error?: string | string[]
      options?: SelectOption[]
      size?: SelectProps['size']
      color?: SelectProps['color']
      placeholder?: string
      selectedItemsDisplayLimit?: number
      contentProps?: SelectContentProps
      portalProps?: SelectPortalProps
    } & SelectRootProps<string>
  >(),
  {
    label: '',
    error: () => [],
    options: () => [],
    size: 'md',
    color: 'gray',
    placeholder: 'Select an option',
    selectedItemsDisplayLimit: 3,
    contentProps: () => ({}),
    portalProps: () => ({}),
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: ModelValue]
  'update:open': [value: boolean]
}>()

const rootProps = computed<SelectRootProps<string>>(() => ({
  open: props.open,
  defaultOpen: props.defaultOpen,
  defaultValue: props.defaultValue,
  modelValue: props.modelValue as string | string[] | undefined,
  by: props.by,
  dir: props.dir,
  multiple: props.multiple,
  autocomplete: props.autocomplete,
  disabled: props.disabled,
  required: props.required,
  name: props.name,
}))

const forwardedRoot = useForwardPropsEmits(rootProps, emit)

type NormalizedOption = { kind: 'option'; option: SelectOptionItem } | { kind: 'group'; label: string; options: SelectOptionItem[] }

const normalizedOptions = computed<NormalizedOption[]>(() => {
  const result: NormalizedOption[] = []

  for (const option of props.options) {
    if (typeof option === 'string') {
      result.push({ kind: 'option', option: { label: option, value: option } })
      continue
    }

    if ('options' in option) {
      const groupedOptions: SelectOptionItem[] = []
      for (const groupedOption of option.options) {
        if (typeof groupedOption === 'string') {
          groupedOptions.push({ label: groupedOption, value: groupedOption })
          continue
        }
        groupedOptions.push(groupedOption)
      }

      result.push({ kind: 'group', label: option.label, options: groupedOptions })
      continue
    }

    result.push({ kind: 'option', option })
  }

  return result
})

const flatOptions = computed<SelectOptionItem[]>(() => {
  const result: SelectOptionItem[] = []
  for (const entry of normalizedOptions.value) {
    if (entry.kind === 'option') {
      result.push(entry.option)
      continue
    }

    for (const option of entry.options) {
      result.push(option)
    }
  }
  return result
})

const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const selectedCount = props.modelValue.length
    if (selectedCount === 0) return ''

    const labels = flatOptions.value.filter((option) => props.modelValue?.includes(option.value)).map((option) => option.label)
    if (selectedCount > props.selectedItemsDisplayLimit) {
      return t('itemSelected_other', { itemsCount: selectedCount })
    }

    return labels.join(', ')
  }

  if (typeof props.modelValue === 'string') {
    const selected = flatOptions.value.find((option) => option.value === props.modelValue)
    return selected?.label ?? props.modelValue
  }

  return ''
})
</script>

<template>
  <fieldset class="flex w-full flex-col">
    <label v-if="$slots.label || label" :class="labelElement({ size })">
      <slot name="label">
        {{ $t(label) }}
      </slot>
      <span v-if="required">*</span>
    </label>

    <SelectRoot v-slot="{ open }" v-bind="forwardedRoot">
      <SelectTrigger :class="trigger({ size, color, disabled })" class="flex w-full items-center justify-between gap-3 rounded-full">
        <SelectValue :placeholder="placeholder">
          <template v-if="multiple && selectedLabel">
            {{ selectedLabel }}
          </template>
        </SelectValue>
        <SelectIcon class="shrink-0">
          <Icon
            name="custom:chevron"
            mode="svg"
            class="size-4 text-inherit transition-transform duration-100 ease-out [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current"
            :class="open ? 'rotate-180' : ''"
          />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal v-bind="portalProps">
        <SelectContent
          v-bind="contentProps"
          :class="content({ size, color })"
          class="z-40 mt-1 max-h-64 w-(--reka-select-trigger-width) overflow-hidden rounded-2xl outline-none"
          position="popper"
          align="center"
        >
          <SelectViewport>
            <template
              v-for="(entry, index) in normalizedOptions"
              :key="entry.kind === 'group' ? `group-${entry.label}-${index}` : `item-${entry.option.value}-${index}`"
            >
              <SelectItem
                v-if="entry.kind === 'option'"
                :value="entry.option.value"
                :disabled="entry.option.disabled"
                :class="item({ size, color })"
                class="relative flex items-center justify-between gap-3 rounded-full outline-none select-none"
              >
                <SelectItemText>{{ entry.option.label }}</SelectItemText>
                <!-- <SelectItemIndicator>
                  <Icon
                    name="ic:round-check"
                    mode="svg"
                    class="size-4 text-inherit [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current"
                  />
                </SelectItemIndicator> -->
              </SelectItem>

              <SelectGroup v-else>
                <SelectLabel class="px-4 py-2 text-[0.875rem] font-medium text-gray-600">
                  {{ entry.label }}
                </SelectLabel>
                <SelectItem
                  v-for="groupedOption in entry.options"
                  :key="groupedOption.value"
                  :value="groupedOption.value"
                  :disabled="groupedOption.disabled"
                  :class="item({ size, color })"
                  class="relative flex items-center justify-between gap-3 rounded-full outline-none select-none"
                >
                  <SelectItemText>{{ groupedOption.label }}</SelectItemText>
                  <!-- <SelectItemIndicator>
                    <Icon
                      name="ic:round-check"
                      mode="svg"
                      class="size-4 text-inherit [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current"
                    />
                  </SelectItemIndicator> -->
                </SelectItem>
              </SelectGroup>
            </template>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <template v-if="Array.isArray(error) ? error.length > 0 : !!error">
      <p v-for="(message, index) in Array.isArray(error) ? error : [error]" :key="`${index}-${message}`" class="mt-1 text-sm text-red-700">
        {{ message }}
      </p>
    </template>
  </fieldset>
</template>
