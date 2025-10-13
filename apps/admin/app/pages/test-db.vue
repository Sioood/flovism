<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const isError = ref(false)

const createUser = async () => {
  try {
    const { data } = await $fetch('/api/users', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
      },
    })
    console.log(data)

    message.value = 'User created successfully!'
    isError.value = false

    // Reset form
    name.value = ''
    email.value = ''
  } catch (error) {
    console.error('Error:', error)
    message.value = 'Error creating user. Check console for details.'
    isError.value = true
  }
}
</script>

<template>
  <div>
    <h1>Test Database</h1>

    <div>
      <h2>Create User</h2>
      <form @submit.prevent="createUser">
        <div>
          <label>Name:</label>
          <input v-model="name" type="text" required />
        </div>
        <div>
          <label>Email:</label>
          <input v-model="email" type="email" required />
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>

    <div v-if="message" :class="[isError ? 'error' : 'success']">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}

.success {
  color: green;
  margin-top: 1rem;
}

div {
  margin-bottom: 1rem;
}

input {
  margin-left: 0.5rem;
}
</style>
