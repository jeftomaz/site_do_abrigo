import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'

// Carrega variáveis do .env.test (valores locais); sem erro se o arquivo não existe
config({ path: '.env.test', override: false })

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',

  // Modo reporter: verbose em CI, lista curta localmente
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    // Navegações relativas com /site_do_abrigo/ já embutido na URL
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // O build deve ser feito antes (via `npm run test:e2e` ou manualmente)
    command: 'npm run preview',
    url: 'http://localhost:4173/site_do_abrigo/',
    // Em CI a cada run; localmente reutiliza se já estiver rodando
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 30_000,
  },
})
