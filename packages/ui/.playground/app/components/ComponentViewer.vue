<script setup lang="ts">
import type { Component } from 'vue'

export interface PropDefinition {
  name: string
  type?: string
  default?: unknown
  required?: boolean
  /** When set, renders a select with these options instead of a text input */
  options?: unknown[]
}

const props = withDefaults(
  defineProps<{
    component: Component & { __name?: string }
    initialProps?: Record<string, unknown>
    defaultComponentBackground?: boolean
    propsSchema?: PropDefinition[]
  }>(),
  {
    initialProps: () => ({}),
    propsSchema: undefined,
    defaultComponentBackground: true,
  },
)

const currentProps = ref<Record<string, unknown>>({ ...props.initialProps })
const componentBackground = ref<boolean>(props.defaultComponentBackground ?? true)

watch(
  () => props.initialProps,
  (next) => {
    currentProps.value = { ...next }
  },
  { deep: true },
)

function getAvailableProps(): PropDefinition[] {
  if (props.propsSchema?.length) return props.propsSchema

  const comp = props.component as Component & {
    props?: Record<string, unknown> | string[]
    __vccOpts?: { props?: Record<string, unknown> | string[] }
  }
  const raw = comp?.__vccOpts?.props ?? comp?.props ?? (comp as { __props?: string[] }).__props

  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((name) => ({ name, type: 'unknown' }))
  }

  return Object.entries(raw).map(([name, opt]) => {
    const option = opt as { type?: unknown; default?: unknown; required?: boolean }
    let typeStr = 'unknown'
    if (option?.type !== undefined) {
      if (Array.isArray(option.type)) {
        typeStr = (option.type as unknown[]).map((t) => (typeof t === 'function' ? ((t as { name?: string }).name ?? 'unknown') : String(t))).join(' | ')
      } else if (typeof option.type === 'function') {
        typeStr = (option.type as { name?: string }).name ?? 'unknown'
      } else {
        typeStr = String(option.type)
      }
    }
    return {
      name,
      type: typeStr,
      default: option?.default,
      required: option?.required ?? false,
    } satisfies PropDefinition
  })
}

const availableProps = computed(() => getAvailableProps())

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return String(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getPropValue(propName: string): unknown {
  return Object.prototype.hasOwnProperty.call(currentProps.value, propName) ? currentProps.value[propName] : undefined
}

function updateProp(key: string, value: unknown): void {
  const next = { ...currentProps.value }
  if (value === undefined) delete next[key]
  else next[key] = value
  currentProps.value = next
}

function clearProp(key: string): void {
  updateProp(key, undefined)
}

function parsePropValue(value: string, type: string | undefined): unknown {
  if (value === '' || value === 'undefined') return undefined
  if (type === 'boolean') return value === 'true'
  if (type === 'number') {
    const n = Number(value)
    return Number.isNaN(n) ? undefined : n
  }
  if (type === 'object') {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  return value
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 p-4">
    <section class="mb-4">
      <h3 class="mb-2 font-medium text-gray-500">Preview {{ component.__name }}</h3>
      <div class="relative flex min-h-10 items-center justify-center rounded border border-gray-200 p-6" :class="{ 'bg-gray-200': componentBackground }">
        <button class="absolute top-2 right-2 cursor-pointer rounded-md p-1 hover:bg-gray-300" @click="componentBackground = !componentBackground">
          <Icon name="ic:baseline-lightbulb" class="size-3 text-gray-400" mode="svg" />
        </button>
        <component :is="component" v-if="component" v-bind="currentProps">
          <slot />
        </component>
        <span v-else class="text-gray-500">No component</span>
      </div>
    </section>

    <section class="mb-4">
      <details>
        <summary class="mb-2 cursor-pointer text-sm font-medium text-gray-500">Available props</summary>
        <ul class="space-y-1 text-sm">
          <li v-for="p in availableProps" :key="p.name" class="flex flex-wrap items-baseline gap-x-2 gap-y-0 font-mono">
            <span class="text-gray-900">{{ p.name }}</span>
            <span v-if="p.type" class="text-gray-500">{{ p.type }}</span>
            <span v-if="p.required" class="text-amber-600">required</span>
            <span v-if="p.default !== undefined" class="text-gray-500">default: {{ formatValue(p.default) }}</span>
          </li>
          <li v-if="availableProps.length === 0" class="text-gray-500">No props (or could not introspect).</li>
        </ul>
      </details>
    </section>

    <section>
      <details>
        <summary class="mb-2 cursor-pointer text-sm font-medium text-gray-500">Props</summary>
        <ul class="space-y-2 text-sm">
          <li v-for="p in availableProps" :key="p.name" class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
            <span class="min-w-24 text-gray-900">{{ p.name }}</span>
            <template v-if="p.type === 'boolean'">
              <input
                type="checkbox"
                :checked="getPropValue(p.name) === true"
                class="rounded border-gray-300"
                @change="updateProp(p.name, ($event.target as HTMLInputElement).checked)"
              />
            </template>
            <template v-else-if="(p.options?.length ?? 0) > 0">
              <select
                :value="getPropValue(p.name) === undefined || getPropValue(p.name) === null ? '' : formatValue(getPropValue(p.name))"
                class="appearance-none rounded border border-gray-300 bg-white px-2 py-1"
                @change="updateProp(p.name, ($event.target as HTMLSelectElement).value || undefined)"
              >
                <option value="">(default)</option>
                <option v-for="opt in p.options" :key="String(opt)" :value="String(opt)">{{ String(opt) }}</option>
              </select>
            </template>
            <template v-else-if="p.type === 'number'">
              <input
                type="number"
                :value="getPropValue(p.name) === undefined || getPropValue(p.name) === null ? '' : getPropValue(p.name)"
                class="w-24 rounded border border-gray-300 px-2 py-1"
                @input="updateProp(p.name, parsePropValue(($event.target as HTMLInputElement).value, 'number'))"
              />
            </template>
            <template v-else>
              <input
                type="text"
                :value="getPropValue(p.name) === undefined || getPropValue(p.name) === null ? '' : formatValue(getPropValue(p.name))"
                class="min-w-32 flex-1 rounded border border-gray-300 px-2 py-1"
                :placeholder="p.default !== undefined ? formatValue(p.default) : ''"
                @input="updateProp(p.name, parsePropValue(($event.target as HTMLInputElement).value, p.type))"
              />
            </template>
            <button
              v-if="getPropValue(p.name) !== undefined"
              type="button"
              class="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              aria-label="Clear to default"
              @click="clearProp(p.name)"
            >
              <Icon name="ic:baseline-close" class="size-4" mode="svg" />
            </button>
          </li>
          <li v-if="availableProps.length === 0" class="text-gray-500">No props (or could not introspect).</li>
        </ul>
      </details>
    </section>
  </div>
</template>
