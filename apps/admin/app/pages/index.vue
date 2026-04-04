<script setup lang="ts">
import type { Route } from '@tuyau/core/types'

const { $api } = useNuxtApp()

const page = ref(1)
const limit = ref(20)
const lang = ref('fr_FR')

const query = computed(
  (): Route.Query<'projects.index'> => ({
    page: page.value,
    limit: limit.value,
    lang: lang.value,
  }),
)

const {
  data: projects,
  metadata,
  pending: projectsLoading,
  error: projectsError,
  refresh: refreshProjects,
} = usePaginatedIndex({
  routeName: 'projects.index',
  client: $api,
  getParams: () => ({}),
  query,
})
</script>

<template>
  <div>
    <h1>Projects</h1>
    <button type="button" class="mr-2 text-sm underline" @click="refreshProjects()">Refresh</button>
    <div v-if="projectsLoading">Loading...</div>
    <div v-else-if="projectsError">Error loading projects</div>
    <div v-else>
      <p v-if="metadata" class="text-sm opacity-80">Page {{ metadata.currentPage }} / {{ metadata.lastPage }} ({{ metadata.total }} total)</p>
      <div v-for="row in projects as Record<string, unknown>[]" :key="String(row.id)">
        <h2>{{ String(row.name ?? row.projectNumber ?? row.id) }}</h2>
      </div>
    </div>
  </div>
</template>
