import type { FetchOptions } from 'ofetch'

export const useApi = () => {
  const { $api } = useNuxtApp()

  const get = <T>(url: string, opts?: FetchOptions) =>
    $api<T>(url, { ...(opts || {}), method: 'GET' })

  const post = <T>(url: string, body?: Record<string, any>, opts?: FetchOptions) =>
    $api<T>(url, { ...(opts || {}), method: 'POST', body })

  const put = <T>(url: string, body?: Record<string, any>, opts?: FetchOptions) =>
    $api<T>(url, { ...(opts || {}), method: 'PUT', body })

  const del = <T>(url: string, opts?: FetchOptions) =>
    $api<T>(url, { ...(opts || {}), method: 'DELETE' })

  const patch = <T>(url: string, body?: Record<string, any>, opts?: FetchOptions) =>
    $api<T>(url, { ...(opts || {}), method: 'PATCH', body })

  return { get, post, put, del, patch }
}


