<script setup lang="ts">
import * as z from 'zod'

import UIFormFileUpload from '~ui/components/Form/FileUpload.vue'
import UIForm from '~ui/components/Form/index.vue'
import UIFormInput from '~ui/components/Form/Input.vue'
import UIFormRadio from '~ui/components/Form/Radio.vue'
import UIFormSelect from '~ui/components/Form/Select.vue'
import UIFormTextarea from '~ui/components/Form/Textarea.vue'
const { locale } = useI18n()

const schema = z.object({
  firstName: z.string().trim().min(5).max(10),
  lastName: z.string().trim().min(1),
  bio: z.string().trim().min(10).max(160),
  favoriteColor: z.string().min(1),
  contactPreference: z.boolean().refine((value) => value === true),
  attachment: z.unknown(),
})

const defaultValues = {
  firstName: '',
  lastName: '',
  bio: '',
  favoriteColor: '',
  contactPreference: false,
  attachment: null,
}

const fields = {
  firstName: {
    as: UIFormInput,
    props: {
      label: 'First Name',
      placeholder: 'John',
      required: true,
    },
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: async ({ value }: { value: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 250))
        return value.includes('error') ? "No 'error' allowed in first name" : undefined
      },
    },
  },
  lastName: {
    as: UIFormInput,
    props: {
      label: 'Last Name',
      placeholder: 'Doe',
      required: true,
    },
  },
  bio: {
    as: UIFormTextarea,
    props: {
      label: 'Bio',
      placeholder: 'Tell us more about you',
      rows: 4,
      required: true,
    },
  },
  favoriteColor: {
    as: UIFormSelect,
    props: {
      label: 'Favorite Color',
      placeholder: 'Choose one',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      required: true,
    },
  },
  contactPreference: {
    as: UIFormRadio,
    props: {
      label: 'Contact by email',
      name: 'contactPreference',
      value: true,
    },
  },
  attachment: {
    as: UIFormFileUpload,
    props: {
      label: 'Attachment',
      placeholder: 'fileUpload_placeholder',
      accept: '.pdf,.png,.jpg,.jpeg',
      multiple: false,
    },
  },
}

const submittedData = ref<string>('')

function onSubmit(value: Record<string, unknown>) {
  submittedData.value = JSON.stringify(value, null, 2)
}
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <ComponentListViewer title="Form Generic" view="list">
      <div class="w-full p-6">
        <UIForm
          :schema="schema"
          :default-values="defaultValues"
          :fields="fields"
          :zod-locale="locale.startsWith('fr') ? 'fr' : 'en'"
          submit-text="Submit"
          submitting-text="Submitting..."
          class="flex w-full flex-col gap-4"
          @submit="onSubmit"
        >
          <template #actions="{ canSubmit, isSubmitting }">
            <button
              type="submit"
              :disabled="!canSubmit"
              class="mt-2 w-fit rounded-full bg-black px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ isSubmitting ? '...' : 'Submit' }}
            </button>
          </template>
        </UIForm>

        <pre v-if="submittedData" class="mt-4 overflow-auto rounded-xl bg-gray-200 p-4 text-sm">{{ submittedData }}</pre>
      </div>
    </ComponentListViewer>
  </div>
</template>
