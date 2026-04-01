<script setup lang="ts">
import UIButton from '~ui/components/Button.vue'
import UIToaster from '~ui/components/Toaster.vue'

const toaster = useToast()

const uploadFile = () => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve() : reject(new Error('Upload failed'))
    }, 2000)
  })
}

const handleUpload = async () => {
  toaster.value?.promise(uploadFile, {
    loading: {
      title: 'Uploading file...',
      description: 'Please wait while we process your file.',
    },
    success: {
      title: 'Upload complete',
      description: 'Your file has been uploaded successfully.',
    },
    error: {
      title: 'Upload failed',
      description: 'There was an error uploading your file. Please try again.',
    },
  })
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-6 p-6">
      <ComponentListViewer title="Toaster">
        <ComponentViewerWrapper :component="UIButton" :initial-props="{ intent: 'primary', size: 'md', color: 'red', iconName: 'custom:plus' }">
          <template #preview>
            <div class="flex flex-wrap gap-2">
              <UIButton
                v-for="type in ['loading', 'info', 'success', 'warning', 'error']"
                :key="type"
                :color="type === 'loading' ? 'gray' : type === 'info' ? 'blue' : type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'"
                @click="toaster?.create({ type, title: 'Hell, world!', description: 'This is a toast', closable: true })"
              >
                Show Toast {{ type }}
              </UIButton>
              <UIButton color="black" @click="handleUpload">Show Toast Promise</UIButton>
            </div>
          </template>
        </ComponentViewerWrapper>

        <UIToaster />
      </ComponentListViewer>
    </div>
  </div>
</template>
