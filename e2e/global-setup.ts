/**
 * Roda uma vez antes de todos os testes E2E.
 *
 * Responsabilidades:
 *   1. Garantir que existe um cão disponível no banco local (seed).
 *   2. Criar (ou recriar) o usuário admin de teste.
 *   3. Fazer enroll TOTP para esse usuário e verificar o fator.
 *   4. Salvar o secret TOTP em e2e/.e2e-state.json para uso nos testes.
 *
 * ATENÇÃO: usa SERVICE_ROLE_KEY — nunca rode contra produção.
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateTOTP, totpWindow } from './totp.ts'

config({ path: '.env.test', override: false })

const __filename = fileURLToPath(import.meta.url)
const __dir = dirname(__filename)

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.E2E_SUPABASE_SERVICE_ROLE_KEY!
const PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL!
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD!

// ID fixo para o cão de seed — facilita limpeza e idempotência
const SEED_DOG_ID = '00000000-0000-0000-0000-e2e000000001'

export default async function globalSetup() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !PUBLISHABLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Variáveis de ambiente E2E ausentes. ' +
      'Copie .env.test.example para .env.test e preencha os valores locais.',
    )
  }

  const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // ── 1. Seed: garantir cão disponível ─────────────────────────────────────
  const { error: dogErr } = await serviceClient.from('dogs').upsert(
    {
      id: SEED_DOG_ID,
      name: 'Rex E2E',
      size: 'médio',
      birth_year: 2021,
      description: 'Cão de seed para testes E2E. Não remova.',
      status: 'available',
      photos: [],
    },
    { onConflict: 'id' },
  )
  if (dogErr) throw new Error(`Seed do cão falhou: ${dogErr.message}`)

  // ── 2. Recriar usuário admin de teste ─────────────────────────────────────
  const { data: { users } } = await serviceClient.auth.admin.listUsers()
  const existing = users.find(u => u.email === ADMIN_EMAIL)
  if (existing) {
    const { error } = await serviceClient.auth.admin.deleteUser(existing.id)
    if (error) throw new Error(`Falha ao deletar usuário existente: ${error.message}`)
  }

  const { data: newUser, error: createErr } = await serviceClient.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  })
  if (createErr || !newUser.user) {
    throw new Error(`Falha ao criar usuário: ${createErr?.message}`)
  }

  // ── 3. Autenticar como o novo usuário (sessão aal1) ───────────────────────
  const userClient = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error: signInErr } = await userClient.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  if (signInErr) throw new Error(`signIn falhou: ${signInErr.message}`)

  // ── 4. Enroll TOTP ────────────────────────────────────────────────────────
  const { data: enrollData, error: enrollErr } = await userClient.auth.mfa.enroll({
    factorType: 'totp',
    issuer: 'Abrigo E2E',
  })
  if (enrollErr || !enrollData) {
    throw new Error(`Enroll TOTP falhou: ${enrollErr?.message}`)
  }

  const totpSecret = enrollData.totp.secret
  const factorId = enrollData.id

  // ── 5. Verificar o fator (torna o status 'verified') ─────────────────────
  const { data: challenge, error: challengeErr } = await userClient.auth.mfa.challenge({ factorId })
  if (challengeErr || !challenge) {
    throw new Error(`Challenge falhou: ${challengeErr?.message}`)
  }

  const setupCode = generateTOTP(totpSecret)
  const setupWindow = totpWindow()

  const { error: verifyErr } = await userClient.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code: setupCode,
  })
  if (verifyErr) throw new Error(`Verificação TOTP no setup falhou: ${verifyErr.message}`)

  // ── 6. Persistir estado para os specs ────────────────────────────────────
  const state = {
    totpSecret,
    adminEmail: ADMIN_EMAIL,
    adminPassword: ADMIN_PASSWORD,
    // Janela TOTP usada no setup (evitar reutilização do código no teste)
    setupTotpWindow: setupWindow,
  }
  writeFileSync(join(__dir, '.e2e-state.json'), JSON.stringify(state, null, 2))

  console.log('✔ Global setup concluído: cão seed + usuário admin + TOTP verificado.')
}
