<script setup lang="ts">
import { z } from 'zod'
import UIFormInput from '~ui/components/Form/Input.vue'
import UIFormTextarea from '~ui/components/Form/Textarea.vue'

import type { Route } from '@tuyau/core/types'

const { $api } = useNuxtApp()
const projectsStore = useProjectsStore()
const { locale } = useI18n()

const page = ref(1)
const limit = ref(20)
/** Index + form: French only */
const lang = ref<'fr_FR'>('fr_FR')

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

const createSchema = z.object({
  projectYear: z
    .string()
    .trim()
    .min(1)
    .regex(/^\d+$/, 'Année invalide')
    .transform((s) => Number(s))
    .pipe(z.number().int().min(1900).max(2100)),
  frSlug: z.string().trim().min(1).max(190),
  frName: z.string().trim().min(1).max(190),
  frDescription: z.string().trim().min(1),
})

const createDefaultValues = {
  projectYear: 2026,
  frSlug: '',
  frName: '',
  frDescription: '',
} as const

const createFields = {
  projectYear: {
    as: UIFormInput,
    props: {
      label: 'Année du projet',
      type: 'number',
      required: true,
    },
  },
  frSlug: {
    as: UIFormInput,
    props: {
      label: 'Slug (fr_FR)',
      required: true,
    },
  },
  frName: {
    as: UIFormInput,
    props: {
      label: 'Nom (fr_FR)',
      required: true,
    },
  },
  frDescription: {
    as: UIFormTextarea,
    props: {
      label: 'Description (fr_FR)',
      rows: 3,
      required: true,
    },
  },
}

type CreateFormValues = z.infer<typeof createSchema>

const createLayout: Array<keyof typeof createDefaultValues | (keyof typeof createDefaultValues)[]> = ['projectYear', ['frSlug', 'frName'], 'frDescription']

const createMessage = ref<string | null>(null)

const onCreateProject = async (value: CreateFormValues) => {
  createMessage.value = null

  const body: Route.Body<'projects.store'> = {
    projectYear: value.projectYear,
    translations: {
      fr_FR: {
        slug: value.frSlug,
        name: value.frName,
        description: value.frDescription,
      },
    },
  }

  const result = await projectsStore.create(body)
  if (result.error) {
    createMessage.value = result.error.message || 'Erreur création'
    return
  }
  createMessage.value = 'Projet créé'
  await refreshProjects()
}
</script>

<template>
  <div>
    <h1>Projects</h1>

    <section class="mb-8 max-w-md rounded border border-neutral-300 p-4 dark:border-neutral-600">
      <h2 class="mb-3 text-lg font-medium">Créer un projet (fr_FR)</h2>
      <UIForm
        :schema="createSchema"
        :default-values="createDefaultValues"
        :fields="createFields"
        :layout="createLayout"
        :zod-locale="locale.startsWith('fr') ? 'fr' : 'en'"
        submit-text="Créer"
        submitting-text="Envoi…"
        class="flex w-full flex-col gap-4"
        @submit="onCreateProject"
      >
        <template #actions="{ canSubmit, isSubmitting }">
          <UIButton :disabled="!canSubmit" :loading="isSubmitting" type="submit" class="w-full"> Créer </UIButton>
        </template>
      </UIForm>
      <p v-if="createMessage" class="mt-3 text-sm" :class="createMessage === 'Projet créé' ? 'text-green-700 dark:text-green-400' : 'text-red-600'">
        {{ createMessage }}
      </p>
    </section>

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
