<script setup lang="ts">
import { TreeItem, TreeRoot } from 'reka-ui'

interface TreeEntry {
  title: string
  icon?: string
  children?: TreeEntry[]
  path?: string
}

const componentPaths = import.meta.glob('~/pages/**/*.vue', { eager: false })
const pathStrings = Object.keys(componentPaths)

function pathToTitle(filename: string): string {
  return filename.replace(/\.vue$/i, '')
}

type TreeMap = Map<string, { title: string; icon: string; children?: TreeMap; path?: string }>

function buildTree(paths: string[]): TreeEntry[] {
  const root: TreeMap = new Map()
  for (const raw of paths) {
    if (raw.includes('index.vue')) continue
    const relative = raw.includes('pages/') ? raw.slice(raw.indexOf('pages/') + 'pages/'.length) : raw
    const parts = relative
      .replace(/\.vue$/i, '')
      .split('/')
      .filter((p): p is string => Boolean(p))
    if (parts.length === 0) continue
    let current = root
    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i]
      if (segment === undefined) continue
      const isLast = i === parts.length - 1
      if (!current.has(segment)) {
        current.set(segment, {
          title: pathToTitle(segment),
          icon: isLast ? 'lucide:file' : 'lucide:folder',
          path: isLast ? `/${relative.replace(/\.vue$/i, '').toLowerCase()}` : undefined,
          ...(isLast ? {} : { children: new Map() }),
        })
      }
      const node = current.get(segment)
      if (!isLast && node?.children) current = node.children
    }
  }
  function mapToArray(map: TreeMap): TreeEntry[] {
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({
        title: v.title,
        icon: v.icon,
        path: v.path,
        ...(v.children?.size ? { children: mapToArray(v.children) } : {}),
      }))
  }
  return mapToArray(root)
}

const items = computed(() => [{ title: 'Home', icon: 'lucide:home', path: '/' }, ...buildTree(pathStrings)])
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    class="w-56 list-none rounded-lg bg-gray-200 p-2 text-sm font-medium text-gray-600 shadow-sm select-none"
    :items="items"
    :get-key="(item) => item.title"
    :default-expanded="[]"
  >
    <h2 class="px-2 pt-1 pb-2 text-sm font-semibold text-gray-400">Components Structure</h2>
    <TreeItem
      v-for="item in flattenItems"
      v-slot="{ isExpanded }"
      :key="item._id"
      :style="{ 'padding-left': `${item.level - 0.5}rem` }"
      v-bind="item.bind"
      class="my-0.5 flex cursor-pointer items-center rounded px-2 py-1 outline-none hover:bg-gray-400 focus:ring-2 focus:ring-gray-300 data-selected:bg-gray-300"
    >
      <template v-if="item.hasChildren">
        <Icon v-if="!isExpanded" mode="svg" name="lucide:folder" class="h-4 w-4" />
        <Icon v-else mode="svg" name="lucide:folder-open" class="h-4 w-4" />
      </template>
      <Icon v-else mode="svg" :name="item.value.icon || 'lucide:file'" class="h-4 w-4" />
      <div class="pl-2">
        {{ item.value.title }}
      </div>
    </TreeItem>
  </TreeRoot>
</template>
