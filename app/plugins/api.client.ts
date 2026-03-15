export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const apiBase = String(config.public.apiBase) + '/api/v1'

  let apiFetch: ReturnType<typeof $fetch.create>

  apiFetch = $fetch.create({
    baseURL: apiBase,
    credentials: 'omit',
    retry: 0,
    onRequest({ options }) {
      const authStore = useAuthStore()

      if (authStore.accessToken) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${authStore.accessToken}`)
        options.headers = headers
      }
    },
    async onResponseError({ response, request, options }): Promise<any> {
      const authStore = useAuthStore()

      // Only attempt refresh once per request
      if (response.status === 401 && !(options as any)._retry) {
        const refreshToken = authStore.refreshToken

        if (!refreshToken) {
          authStore.logout()
          router.push('/admin/auth/login')
          throw response._data ?? response
        }

        try {
          const refreshed = await $fetch<{
            access: string
            refresh?: string
          }>('/auth/token/refresh/', {
            baseURL: apiBase,
            method: 'POST',
            body: { refresh: refreshToken },
          })

          authStore.setTokens({
            accessToken: refreshed.access,
            refreshToken: refreshed.refresh ?? refreshToken,
          })

            ; (options as any)._retry = true
          return apiFetch(request as any, options as any)
        }
        catch (error) {
          authStore.logout()
          router.push('/admin/auth/login')
          throw error
        }
      }

      throw response._data ?? response
    },
  })

  return {
    provide: {
      api: apiFetch,
    },
  }
})

