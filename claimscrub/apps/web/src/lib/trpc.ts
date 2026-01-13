import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import type { AppRouter } from '@claimscrub/api/src/trpc/router'
import { getAuthToken } from './supabase'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL || ''}/api/trpc`,
      async headers() {
        const token = await getAuthToken()
        return {
          authorization: token ? `Bearer ${token}` : '',
        }
      },
    }),
  ],
})
