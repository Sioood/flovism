/**
 * Tuyau CRUD + index fetch. Mutations: show/store/update/destroy. Lists: `fetchPaginated`
 * (store-friendly) or `usePaginatedIndex` (Nuxt cache + `useAsyncData`; uses `fetchTuyauIndex` internally).
 * Prefer paginated index responses — avoid a monolithic `fetchAll` that loads every row.
 *
 * Types: `Route.*` from `@tuyau/core/types` and the generated registry only.
 */

import { registry } from '@flovism/api/registry'

import type { Tuyau, TuyauError } from '@tuyau/core/client'
import type { Route } from '@tuyau/core/types'

type ApiRegistry = typeof registry
export type TuyauRouteName = keyof ApiRegistry['routes'] & string

export type CrudRoutesConst = {
  readonly index: TuyauRouteName
  readonly show: TuyauRouteName
  readonly store: TuyauRouteName
  readonly update: TuyauRouteName
  readonly destroy: TuyauRouteName
}

export type ScopeOf<R extends CrudRoutesConst> = Route.Params<R['index']>
export type MemberUrlParam<R extends CrudRoutesConst> = Extract<keyof Omit<Route.Params<R['show']>, keyof Route.Params<R['index']>>, string>

/** Strip `{ data, metadata? }` from serializer-shaped responses. */
type UnwrapEnvelope<T> = T extends { data: infer D } ? D : T

/** If the JSON body has a `data` key, return it; else `body`. */
export function unwrapSerializedBody<T>(body: T): UnwrapEnvelope<T> {
  if (body !== null && typeof body === 'object' && 'data' in body) {
    return (body as { data: UnwrapEnvelope<T> }).data
  }
  return body as UnwrapEnvelope<T>
}

export type CrudResult<T> = { data: T; error: null } | { data: null; error: TuyauError }

/**
 * Typed GET index (paginated or not). Safe for Pinia actions — no `useAsyncData`.
 * For SSR/cache + auto refetch, use `usePaginatedIndex` which calls this internally.
 */
export async function fetchTuyauIndex<N extends TuyauRouteName>(
  client: Tuyau<typeof registry>,
  routeName: N,
  args: { params: Route.Params<N>; query: Route.Query<N> },
): Promise<CrudResult<Route.Response<N>>> {
  const [data, error] = await client.request(routeName, { params: args.params as never, query: args.query as never } as never).safe()
  if (error) return { data: null, error }
  return { data, error: null }
}

function asMemberParams(memberUrlParam: string, memberId: string): Record<string, string> {
  return { [memberUrlParam]: memberId }
}

export type CreateTuyauCrudOptions<R extends CrudRoutesConst> = {
  client: Tuyau<typeof registry>
  routes: R
  getScope: () => ScopeOf<R>
  memberUrlParam: MemberUrlParam<R>
}

export function createTuyauCrud<R extends CrudRoutesConst>(options: CreateTuyauCrudOptions<R>) {
  const { client, routes, getScope, memberUrlParam } = options

  const loading = ref(false)

  /** Current index page (`page` / `limit` / filters in `query`). Safe to call from Pinia actions. */
  const fetchPaginated = async (query: Route.Query<R['index']>): Promise<CrudResult<Route.Response<R['index']>>> => {
    loading.value = true
    try {
      const scope = getScope()
      return await fetchTuyauIndex(client, routes.index, {
        params: scope as Route.Params<R['index']>,
        query,
      })
    } finally {
      loading.value = false
    }
  }

  const mergeParams = (extra: Record<string, string | number | boolean>) => {
    const scope = getScope() as Record<string, string | number | boolean>
    return { ...scope, ...extra } as Route.Params<R['show']> & Route.Params<R['update']> & Route.Params<R['destroy']>
  }

  const fetchOne = async (memberId: string, opts?: { query?: Route.Query<R['show']> }): Promise<CrudResult<Route.Response<R['show']>>> => {
    loading.value = true
    try {
      const params = mergeParams(asMemberParams(memberUrlParam, memberId)) as Route.Params<R['show']>
      const [data, error] = await client
        .request(routes.show, {
          params,
          ...(opts?.query && Object.keys(opts.query).length ? { query: opts.query } : {}),
        } as never)
        .safe()
      if (error) return { data: null, error }
      return { data, error: null }
    } finally {
      loading.value = false
    }
  }

  const create = async (body: Route.Body<R['store']>, opts?: { query?: Route.Query<R['store']> }): Promise<CrudResult<Route.Response<R['store']>>> => {
    loading.value = true
    try {
      const scope = getScope()
      const [data, error] = await client
        .request(routes.store, {
          params: scope as Route.Params<R['store']>,
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

  const update = async (
    memberId: string,
    body: Route.Body<R['update']>,
    opts?: { query?: Route.Query<R['update']> },
  ): Promise<CrudResult<Route.Response<R['update']>>> => {
    loading.value = true
    try {
      const params = mergeParams(asMemberParams(memberUrlParam, memberId)) as Route.Params<R['update']>
      const [data, error] = await client
        .request(routes.update, {
          params,
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

  const remove = async (memberId: string): Promise<CrudResult<Route.Response<R['destroy']>>> => {
    loading.value = true
    try {
      const params = mergeParams(asMemberParams(memberUrlParam, memberId)) as Route.Params<R['destroy']>
      const [data, error] = await client.request(routes.destroy, { params } as never).safe()
      if (error) return { data: null, error }
      return { data, error: null }
    } finally {
      loading.value = false
    }
  }

  return {
    routes,
    loading,
    fetchPaginated,
    fetchOne,
    create,
    update,
    remove,
  }
}
