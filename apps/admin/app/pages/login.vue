<script setup lang="ts">
import { z } from 'zod'
import UIFormInput from '~ui/components/Form/Input.vue'

const { login, user } = extractStore(useUserStore())

const schema = z.object({
  email: z.email(),
  password: z.string().min(12),
})

const defaultValues = {
  email: '',
  password: '',
}

const fields = {
  email: {
    as: UIFormInput,
    props: {
      label: 'email',
      required: true,
    },
  },
  password: {
    as: UIFormInput,
    props: {
      label: 'password',
      type: 'password',
      required: true,
    },
  },
}

const handleSubmit = async (values: typeof defaultValues) => {
  await login(values.email, values.password)

  if (user.value) navigateTo('/')
}

definePageMeta({
  middleware: [
    (_to, from) => {
      const { user } = extractStore(useUserStore())
      // TODO add toast "already logged in"
      if (user.value) return from.path && from.path !== '/login' ? navigateTo(from.path) : navigateTo('/')
    },
  ],
})
</script>

<template>
  <div class="flex h-dvh w-full items-center justify-center">
    <div class="w-full max-w-sm p-4">
      <UIForm :schema="schema" :default-values="defaultValues" :fields="fields" submit-text="login" @submit="handleSubmit" />
    </div>
  </div>
</template>
