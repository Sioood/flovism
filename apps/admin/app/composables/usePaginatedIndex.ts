/**
 * Paginated list fetch via Tuyau + `useAsyncData` (see Adonis type-safe API client).
 * Types come from `Route.Params` / `Route.Query` / `Route.Response` only.
 */

import { registry } from '@flovism/api/registry'

import { fetchTuyauIndex } from '~/utils/tuyau-crud'

import type { Tuyau } from '@tuyau/core/client'
import type { Route } from '@tuyau/core/types'

export type PaginatedIndexRouteName = keyof typeof registry.routes & string

export type UsePaginatedIndexOptions<N extends PaginatedIndexRouteName> = {
  routeName: N
  client: Tuyau<typeof registry>
  getParams: () => Route.Params<N>
  query: MaybeRefOrGetter<Route.Query<N>>
  /** Prefix for `useAsyncData` key (default: routeName) */
  keyPrefix?: string
}

/**
 * Fetches a paginated index route; exposes `rows` (`data` array) and Lucid-like `metadata`.
 * Call `refresh()` after mutations (create/update/destroy) or rely on `watch` when `query`/`params` change.
 */
export function usePaginatedIndex<N extends PaginatedIndexRouteName>(options: UsePaginatedIndexOptions<N>) {
  const { routeName, client, getParams, query } = options
  const keyPrefix = options.keyPrefix ?? routeName

  const snapshot = computed(() => ({
    params: getParams(),
    query: toValue(query),
  }))

  const {
    data: payload,
    pending,
    error,
    refresh,
  } = useAsyncData(
    `${keyPrefix}-paginated`,
    async () => {
      const { params, query: q } = snapshot.value
      const result = await fetchTuyauIndex(client, routeName, { params, query: q })
      if (result.error) throw result.error
      return result.data
    },
    {
      watch: [snapshot],
    },
  )

  const data = computed(() => {
    const v = payload.value
    if (!v || typeof v !== 'object' || !('data' in v)) return []
    const d = (v as { data: unknown }).data
    return Array.isArray(d) ? d : []
  })

  const metadata = computed(() => {
    const v = payload.value
    if (!v || typeof v !== 'object' || !('metadata' in v)) return undefined
    return (v as { metadata: Record<string, unknown> }).metadata
  })

  return { payload, data, metadata, pending, error, refresh }
}
