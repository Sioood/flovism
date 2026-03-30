<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { cva, type VariantProps } from 'class-variance-authority'

type FileModelValue = File | File[] | null
type FileRejectionReason = 'limit' | 'accept' | 'max-size' | 'min-size'

type FileRejection = {
  file: File
  reason: FileRejectionReason
}

const fileUploadRoot = cva('flex flex-col gap-4')

const fileUploadWrap = cva('rounded-[1.875rem] p-2', {
  variants: {
    color: {
      gray: 'bg-gray-300',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

const fileUploadDropZone = cva(
  'flex min-h-13 w-full rounded-[calc(1.875rem-var(--spacing)*2)] border-2 border-dashed text-center transition-all duration-150',
  {
    variants: {
      size: {
        md: 'p-4 text-sub',
      },
      color: {
        gray: 'border-gray-400 bg-gray-300 text-gray-500',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-75',
        false: 'cursor-pointer',
      },
      over: {
        true: 'outline-2 outline-black outline-dashed',
        false: 'outline-none',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'gray',
      disabled: false,
      over: false,
    },
  },
)

const fileGrid = cva('grid w-full grid-cols-4 gap-4 md:grid-cols-5 lg:grid-cols-6')

const fileTile = cva('relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl p-2', {
  variants: {
    color: {
      gray: 'bg-gray-200',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

const addFileTile = cva(
  'flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-4 transition-opacity disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      color: {
        gray: 'border-gray-400 bg-gray-200 text-gray-600',
      },
    },
    defaultVariants: {
      color: 'gray',
    },
  },
)

const emptyState = cva('flex w-full flex-col items-center justify-center gap-4')

const nativeFileInput = cva('hidden')

const uploadGlyph = cva('[&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current', {
  variants: {
    usage: {
      empty: 'size-4 text-inherit',
      addTile: 'size-7 text-gray-600',
    },
  },
  defaultVariants: {
    usage: 'empty',
  },
})

const fileGlyph = cva('size-8 text-gray-600 [&_svg]:fill-current [&_svg]:stroke-current [&_svg_*]:fill-current [&_svg_*]:stroke-current')

const fileNameText = cva('line-clamp-2 max-w-full text-center text-sm leading-5 text-gray-600')

const fileSizeText = cva('text-xs text-gray-500')

const placeholderText = cva('text-gray-600')

const addFileLabel = cva('text-sm text-gray-600')

const removeTileButton = cva('absolute top-2 right-2')

const labelElement = cva('label', {
  variants: {
    size: {
      md: 'text-base',
    },
  },
})

type FileUploadLayoutProps = VariantProps<typeof fileUploadDropZone>

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    label?: string
    placeholder?: string
    modelValue?: FileModelValue
    size?: FileUploadLayoutProps['size']
    color?: FileUploadLayoutProps['color']
    disabled?: boolean
    required?: boolean
    multiple?: boolean
    limit?: number
    accept?: string
    minFileSize?: number
    maxFileSize?: number
    capture?: 'user' | 'environment'
    browseOnClick?: boolean
    showSelectedFiles?: boolean
  }>(),
  {
    id: '',
    name: '',
    label: '',
    placeholder: 'fileUpload_placeholder',
    modelValue: null,
    size: 'md',
    color: 'gray',
    disabled: false,
    required: false,
    multiple: false,
    limit: 1,
    accept: '',
    minFileSize: undefined,
    maxFileSize: undefined,
    capture: undefined,
    browseOnClick: true,
    showSelectedFiles: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: FileModelValue]
  change: [value: FileModelValue]
  'files-rejected': [rejections: FileRejection[]]
}>()

const inputRef = ref<HTMLInputElement>()
const dropZoneRef = ref<HTMLElement>()

const currentFiles = computed<File[]>(() => {
  if (!props.modelValue) return []
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
})

const resolvedLimit = computed(() => {
  if (!props.multiple) return 1
  return props.limit > 0 ? props.limit : Number.POSITIVE_INFINITY
})

const canAddMoreFiles = computed(() => currentFiles.value.length < resolvedLimit.value)

const acceptTokens = computed(() =>
  props.accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean),
)

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`
  const kb = size / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

function isFileAccepted(file: File): boolean {
  if (acceptTokens.value.length === 0) return true

  const filename = file.name.toLowerCase()
  const mimeType = file.type.toLowerCase()

  for (const token of acceptTokens.value) {
    if (token.startsWith('.')) {
      if (filename.endsWith(token)) return true
      continue
    }

    if (token.endsWith('/*')) {
      const mimeGroup = token.replace('/*', '/')
      if (mimeType.startsWith(mimeGroup)) return true
      continue
    }

    if (mimeType === token) return true
  }

  return false
}

function buildModelValue(files: File[]): FileModelValue {
  if (props.multiple) return files
  return files[0] ?? null
}

function dedupeFiles(files: File[]): File[] {
  const map = new Map<string, File>()
  for (const file of files) {
    const key = `${file.name}-${file.size}-${file.lastModified}`
    if (!map.has(key)) {
      map.set(key, file)
    }
  }
  return [...map.values()]
}

function processIncomingFiles(fileList: File[]): void {
  if (props.disabled || fileList.length === 0) return

  const rejections: FileRejection[] = []
  const accepted: File[] = []

  for (const file of fileList) {
    if (!isFileAccepted(file)) {
      rejections.push({ file, reason: 'accept' })
      continue
    }

    if (typeof props.maxFileSize === 'number' && file.size > props.maxFileSize) {
      rejections.push({ file, reason: 'max-size' })
      continue
    }

    if (typeof props.minFileSize === 'number' && file.size < props.minFileSize) {
      rejections.push({ file, reason: 'min-size' })
      continue
    }

    accepted.push(file)
  }

  const merged = props.multiple ? dedupeFiles([...currentFiles.value, ...accepted]) : accepted.slice(0, 1)
  const nextFiles = merged.slice(0, resolvedLimit.value)
  if (merged.length > nextFiles.length) {
    for (const file of merged.slice(nextFiles.length)) {
      rejections.push({ file, reason: 'limit' })
    }
  }

  const nextValue = buildModelValue(nextFiles)
  emit('update:modelValue', nextValue)
  emit('change', nextValue)

  if (rejections.length > 0) {
    emit('files-rejected', rejections)
  }
}

function onInputChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const files = target.files ? [...target.files] : []
  processIncomingFiles(files)
  target.value = ''
}

function openFileDialog(): void {
  if (props.disabled || !props.browseOnClick) return
  inputRef.value?.click()
}

function removeFile(index: number): void {
  if (props.disabled) return

  if (props.multiple) {
    const next = [...currentFiles.value]
    next.splice(index, 1)
    const nextValue = buildModelValue(next)
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
    return
  }

  emit('update:modelValue', null)
  emit('change', null)
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  multiple: props.multiple,
  onDrop: (files) => {
    if (!files) return
    processIncomingFiles(files)
  },
  dataTypes: acceptTokens,
  preventDefaultForUnhandled: true,
})
</script>

<template>
  <fieldset :class="fileUploadRoot()">
    <label v-if="label" :class="labelElement({ size })">
      {{ label }}
      <span v-if="required">*</span>
    </label>

    <input
      :id="id || undefined"
      ref="inputRef"
      type="file"
      :class="nativeFileInput()"
      :name="name || undefined"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      :required="required && currentFiles.length === 0"
      :capture="capture"
      @change="onInputChange"
    />

    <div :class="fileUploadWrap({ color })">
      <div
        ref="dropZoneRef"
        :class="
          fileUploadDropZone({
            size,
            color,
            disabled,
            over: isOverDropZone && !disabled,
          })
        "
        role="button"
        tabindex="0"
        :aria-disabled="disabled ? 'true' : 'false'"
        @click="openFileDialog"
        @keydown.enter.prevent="openFileDialog"
        @keydown.space.prevent="openFileDialog"
      >
        <div v-if="showSelectedFiles && currentFiles.length > 0" :class="fileGrid()">
          <article v-for="(file, index) in currentFiles" :key="`${file.name}-${file.size}-${file.lastModified}`" :class="fileTile({ color })">
            <UIButton
              variant="ghost"
              color="gray"
              :disabled="disabled"
              icon-name="custom:cross"
              :class="removeTileButton()"
              size="xs"
              @click.stop="removeFile(index)"
            />
            <Icon name="custom:pdf" mode="svg" :class="fileGlyph()" />
            <span :class="fileNameText()">{{ file.name }}</span>
            <span :class="fileSizeText()">{{ formatBytes(file.size) }}</span>
          </article>

          <button v-if="canAddMoreFiles" type="button" :class="addFileTile({ color })" :disabled="disabled || !browseOnClick" @click.stop="openFileDialog">
            <Icon name="custom:upload" mode="svg" :class="uploadGlyph({ usage: 'addTile' })" />
            <span :class="addFileLabel()"> {{ $t('addFile') }} </span>
          </button>
        </div>

        <div v-else :class="emptyState()">
          <Icon name="custom:upload" mode="svg" :class="uploadGlyph({ usage: 'empty' })" />
          <span :class="placeholderText()">
            {{ $t(placeholder) }}
          </span>
        </div>
      </div>
    </div>
  </fieldset>
</template>
