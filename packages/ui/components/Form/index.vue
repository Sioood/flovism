<script setup lang="ts" generic="TValues extends Record<string, unknown>">
import { useForm } from '@tanstack/vue-form'
import { watchEffect } from 'vue'
import * as z from 'zod'

import type { Component } from 'vue'

type SchemaIssue = {
  message?: string
  path?: unknown[]
}

type SafeParseSuccess<TData> = {
  success: true
  data: TData
}

type SafeParseError = {
  success: false
  error: {
    issues?: SchemaIssue[]
  }
}

type SafeParseResult<TData> = SafeParseSuccess<TData> | SafeParseError

type GenericObjectSchema<TData extends Record<string, unknown>> = {
  safeParse: (value: unknown) => SafeParseResult<TData>
}

type FieldName<TData extends Record<string, unknown>> = Extract<keyof TData, string>

type FieldSyncValidator<TValue> = (payload: { value: TValue }) => string | string[] | undefined
type FieldAsyncValidator<TValue> = (payload: { value: TValue }) => Promise<string | string[] | undefined> | string | string[] | undefined

type FieldValidators<TValue> = {
  onChange?: FieldSyncValidator<TValue>
  onBlur?: FieldSyncValidator<TValue>
  onChangeAsyncDebounceMs?: number
  onBlurAsyncDebounceMs?: number
  onChangeAsync?: FieldAsyncValidator<TValue>
  onBlurAsync?: FieldAsyncValidator<TValue>
}

type FormFieldConfig<TData extends Record<string, unknown>, TName extends FieldName<TData>> = {
  as?: string | Component
  label?: string
  props?: Record<string, unknown>
  validators?: FieldValidators<TData[TName]>
}

type FormFieldConfigMap<TData extends Record<string, unknown>> = Partial<{
  [K in FieldName<TData>]: FormFieldConfig<TData, K>
}>

type ZodLocaleFactory = () => z.core.$ZodConfig
type FormLayoutRow<TData extends Record<string, unknown>> = Array<FieldName<TData>>
type FormLayout<TData extends Record<string, unknown>> = Array<FieldName<TData> | FormLayoutRow<TData>>

const props = withDefaults(
  defineProps<{
    schema: GenericObjectSchema<TValues>
    defaultValues: TValues
    fields: FormFieldConfigMap<TValues>
    as?: string | Component
    layout?: FormLayout<TValues>
    submitText?: string
    submittingText?: string
    zodLocale?: string
  }>(),
  {
    as: 'form',
    layout: () => [],
    submitText: 'submit',
    submittingText: '...',
    zodLocale: 'fr',
  },
)

const emit = defineEmits<{
  submit: [value: TValues]
}>()

watchEffect(() => {
  const localeFactory = (z.locales as Record<string, unknown>)[props.zodLocale]
  if (typeof localeFactory === 'function') {
    z.config((localeFactory as ZodLocaleFactory)())
  }
})

const form = useForm({
  defaultValues: props.defaultValues,
  onSubmit: async ({ value }) => {
    const parsed = props.schema.safeParse(value)

    if (!parsed.success) {
      return
    }

    emit('submit', parsed.data)
  },
})

const fieldEntries = computed(() =>
  (Object.entries(props.fields) as Array<[FieldName<TValues>, FormFieldConfig<TValues, FieldName<TValues>> | undefined]>).filter(
    (entry): entry is [FieldName<TValues>, FormFieldConfig<TValues, FieldName<TValues>>] => Boolean(entry[1]),
  ),
)

const fieldConfigByName = computed(() => {
  const result: Partial<Record<FieldName<TValues>, FormFieldConfig<TValues, FieldName<TValues>>>> = {}
  for (const [name, config] of fieldEntries.value) {
    result[name] = config
  }
  return result
})

const normalizedLayout = computed(() => {
  const layout = props.layout

  if (!layout || layout.length === 0) {
    return fieldEntries.value.map(([name]) => [name] as Array<FieldName<TValues>>)
  }

  const rows: Array<Array<FieldName<TValues>>> = []
  for (const row of layout) {
    if (Array.isArray(row)) {
      rows.push(row)
      continue
    }
    rows.push([row])
  }

  return rows
})

function getSchemaErrors(name: FieldName<TValues>, value: unknown): string[] | undefined {
  const nextValues = {
    ...(form.state.values as Record<string, unknown>),
    [name]: value,
  }
  const parsed = props.schema.safeParse(nextValues)

  if (parsed.success) {
    return undefined
  }

  const fieldMessages = (parsed.error.issues ?? [])
    .filter((issue) => {
      if (!Array.isArray(issue.path) || issue.path.length === 0) {
        return false
      }

      const issuePath = issue.path.map((segment) => String(segment)).join('.')
      return issuePath === name
    })
    .map((issue) => issue.message?.trim())
    .filter((message): message is string => Boolean(message))

  return fieldMessages.length > 0 ? fieldMessages : undefined
}

function createSyncValidator<TName extends FieldName<TValues>>(name: TName, customValidator?: FieldSyncValidator<TValues[TName]>) {
  return ({ value }: { value: TValues[TName] }) => {
    const schemaErrors = getSchemaErrors(name, value)

    if (schemaErrors) {
      return schemaErrors
    }

    return customValidator?.({ value })
  }
}

function getFieldValidators<TName extends FieldName<TValues>>(name: TName, config: FormFieldConfig<TValues, TName>) {
  const custom = config.validators

  return {
    onChange: createSyncValidator(name, custom?.onChange),
    onBlur: createSyncValidator(name, custom?.onBlur),
    onChangeAsyncDebounceMs: custom?.onChangeAsyncDebounceMs,
    onBlurAsyncDebounceMs: custom?.onBlurAsyncDebounceMs,
    onChangeAsync: custom?.onChangeAsync,
    onBlurAsync: custom?.onBlurAsync,
  }
}

function extractInputValue(event: Event): unknown {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null
  return target?.value
}

function getFieldError(state: { meta?: { isTouched?: boolean; errors?: unknown[] } }): string[] {
  if (!state.meta?.isTouched) {
    return []
  }

  const errors = state.meta.errors ?? []
  const messages: string[] = []
  for (const error of errors) {
    if (Array.isArray(error)) {
      for (const nestedError of error) {
        const message = String(nestedError).trim()
        if (message) {
          messages.push(message)
        }
      }
      continue
    }

    const message = String(error ?? '').trim()
    if (message) {
      messages.push(message)
    }
  }

  return messages
}

function onSubmit(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  form.handleSubmit()
}
</script>

<template>
  <component :is="as" class="flex flex-col gap-4" @submit="onSubmit">
    <slot :form="form" :fields="fields">
      <div v-for="(row, rowIndex) in normalizedLayout" :key="`row-${rowIndex}`" class="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div v-for="name in row" :key="name" :class="row.length > 1 ? 'md:col-span-6' : 'md:col-span-12'">
          <form.Field v-if="fieldConfigByName[name]" :name="name" :validators="getFieldValidators(name, fieldConfigByName[name]!) as never">
            <template #default="{ field, state }">
              <slot :name="`field-${name}`" :field="field" :state="state" :field-name="name" :config="fieldConfigByName[name]">
                <label v-if="fieldConfigByName[name]?.label" :for="name">
                  {{ fieldConfigByName[name]?.label }}
                </label>

                <component
                  :is="fieldConfigByName[name]?.as ?? 'input'"
                  :id="name"
                  :name="name"
                  v-bind="fieldConfigByName[name]?.props"
                  :value="field.state.value"
                  :model-value="field.state.value"
                  :error="getFieldError(state)"
                  @update:model-value="(value: unknown) => field.handleChange(value as never)"
                  @input="(event: Event) => field.handleChange(extractInputValue(event) as never)"
                  @blur="field.handleBlur"
                />
              </slot>
            </template>
          </form.Field>
        </div>
      </div>

      <form.Subscribe>
        <template #default="{ canSubmit, isSubmitting }">
          <slot name="actions" :form="form" :can-submit="canSubmit" :is-submitting="isSubmitting">
            <div class="mt-4 flex w-full justify-end">
              <UIButton color="yellow" type="submit" :disabled="!canSubmit">
                {{ isSubmitting ? $t(submittingText) : $t(submitText) }}
              </UIButton>
            </div>
          </slot>
        </template>
      </form.Subscribe>
    </slot>
  </component>
</template>
