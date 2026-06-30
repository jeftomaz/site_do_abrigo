/**
 * T-07 — E2E admin com TOTP automatizado (Camada 5)
 *
 * Cobre: login admin → verificação 2FA (código TOTP gerado pela função
 * local `generateTOTP` a partir do secret salvo pelo global-setup) →
 * acesso confirmado a /admin.
 *
 * O global-setup cria o usuário de teste e faz o enroll+verificação TOTP,
 * salvando o secret em e2e/.e2e-state.json. Este spec lê esse arquivo e
 * gera um código TOTP fresco — sem app externo.
 *
 * Lógica anti-colisão: se o teste cair na mesma janela TOTP do setup
 * (mesmo código de 6 dígitos), aguarda a próxima janela (≤ 30s) para
 * garantir um código diferente e evitar rejeição por replay.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateTOTP, totpWindow } from './totp.ts'

const __filename = fileURLToPath(import.meta.url)
const __dir = dirname(__filename)

interface E2EState {
  totpSecret: string
  adminEmail: string
  adminPassword: string
  setupTotpWindow: number
}

function readState(): E2EState {
  const raw = readFileSync(join(__dir, '.e2e-state.json'), 'utf-8')
  return JSON.parse(raw) as E2EState
}

/**
 * Gera código TOTP garantindo que seja de uma janela diferente do setup,
 * para evitar rejeição por replay protection do Supabase Auth.
 */
async function freshTotpCode(state: E2EState, page: import('@playwright/test').Page): Promise<string> {
  if (totpWindow() === state.setupTotpWindow) {
    const secondsIntoWindow = Math.floor(Date.now() / 1000) % 30
    await page.waitForTimeout((30 - secondsIntoWindow + 1) * 1000)
  }
  return generateTOTP(state.totpSecret)
}

const BASE = '/site_do_abrigo'

test('login admin com TOTP → acesso a /admin', async ({ page }) => {
  const state = readState()

  // ── 1. Login com e-mail e senha ─────────────────────────────────────────
  await page.goto(`${BASE}/admin/login`)
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()

  await page.getByPlaceholder('E-mail').fill(state.adminEmail)
  await page.getByPlaceholder('Senha').fill(state.adminPassword)
  await page.getByRole('button', { name: 'Entrar' }).click()

  // ── 2. AdminGuard detecta aal1 + fator verificado → redireciona para /verify
  await page.waitForURL(`**${BASE}/admin/verify`, { timeout: 10_000 })
  await expect(
    page.getByRole('heading', { name: /Verifica/i }),
  ).toBeVisible()

  // ── 3. Gerar código TOTP fresco (janela diferente do setup) ─────────────
  const code = await freshTotpCode(state, page)

  // ── 4. Preencher e submeter o código TOTP ────────────────────────────────
  // Aguarda o botão ser habilitado: indica que listFactors() completou
  // e factorId está disponível (VerifyTOTPPage desabilita enquanto carrega).
  await page.getByPlaceholder('000000').fill(code)
  const verifyBtn = page.getByRole('button', { name: 'Verificar' })
  await expect(verifyBtn).toBeEnabled({ timeout: 5_000 })
  await verifyBtn.click()

  // ── 5. Confirmar acesso ao painel admin ──────────────────────────────────
  await page.waitForURL(`**${BASE}/admin`, { timeout: 10_000 })
  await expect(page.getByRole('heading', { name: 'Painel Admin' })).toBeVisible()
})
