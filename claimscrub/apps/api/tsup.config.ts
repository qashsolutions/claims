import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'trpc/router': 'src/trpc/router.ts',
    'trpc/context': 'src/trpc/context.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: [
    '@claimscrub/shared',
    '@claimscrub/validators',
    '@prisma/client',
    '@anthropic-ai/sdk',
    'hono',
    '@hono/node-server',
    '@hono/trpc-server',
    '@trpc/server',
    '@supabase/supabase-js',
    '@upstash/ratelimit',
    '@upstash/redis',
    'pino',
    'stripe',
    'zod',
  ],
})
