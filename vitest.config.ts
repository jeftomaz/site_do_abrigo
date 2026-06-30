import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      exclude: ['**/node_modules/**', 'e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: ['src/test/**', 'e2e/**'],
      },
    },
  }),
)
