import { defineStore } from 'pinia'

import type { Route } from '@tuyau/core/types'
import type { CrudResult } from '~/utils/tuyau-crud'

/**
 * Font metrics are a singleton per font: only `show`, `update`, and `destroy` (no index/store).
 */
export const useFontMetricsStore = defineStore('fontMetrics', () => {
  const { $api } = useNuxtApp()
  const activeFontId = ref<string | null>(null)
  const loading = ref(false)

  const requireFontId = (): string => {
    const id = activeFontId.value
    if (!id) throw new Error('fontMetrics: set active font id before calling the API')
    return id
  }

  const setActiveFontId = (fontId: string | null) => {
    activeFontId.value = fontId
  }

  const fetchShow = async (opts?: { query?: Route.Query<'font_metrics.show'> }): Promise<CrudResult<Route.Response<'font_metrics.show'>>> => {
    loading.value = true
    try {
      const fontId = requireFontId()
      const [data, error] = await $api
        .request('font_metrics.show', {
          params: { fontId },
          ...(opts?.query && Object.keys(opts.query).length ? { query: opts.query } : {}),
        } as never)
        .safe()
      if (error) return { data: null, error }
      return { data, error: null }
    } finally {
      loading.value = false
    }
  }

  const update = async (
    body: Route.Body<'font_metrics.update'>,
    opts?: { query?: Route.Query<'font_metrics.update'> },
  ): Promise<CrudResult<Route.Response<'font_metrics.update'>>> => {
    loading.value = true
    try {
      const fontId = requireFontId()
      const [data, error] = await $api
        .request('font_metrics.update', {
          params: { fontId },
          body,
          ...(opts?.query && Object.keys(opts.query).length ? { query: opts.query } : {}),
        } as never)
        .safe()
      if (error) return { data: null, error }
      return { data, error: null }
    } finally {
      loading.value = false
    }
  }

  const remove = async (): Promise<CrudResult<Route.Response<'font_metrics.destroy'>>> => {
    loading.value = true
    try {
      const fontId = requireFontId()
      const [data, error] = await $api.request('font_metrics.destroy', { params: { fontId } } as never).safe()
      if (error) return { data: null, error }
      return { data, error: null }
    } finally {
      loading.value = false
    }
  }

  return {
    activeFontId,
    loading,
    setActiveFontId,
    fetchShow,
    update,
    remove,
  }
})
