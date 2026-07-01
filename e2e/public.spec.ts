/**
 * T-06 — E2E público (Camada 5)
 *
 * Cobre: landing carrega → navega para /adocao → abre modal de detalhes
 * de um cão (seed "Rex E2E" inserido pelo global-setup) → CTA do Google
 * Forms presente.
 *
 * Pré-requisito: `npx supabase start` + `npx supabase db reset` rodando
 * e `npm run test:e2e` (que builda com modo test + roda os specs).
 */
import { test, expect } from '@playwright/test'

const BASE = '/site_do_abrigo'

test.describe('Público', () => {
  test('landing carrega com Header e seções principais', async ({ page }) => {
    await page.goto(`${BASE}/`)

    // Header presente com link da marca
    await expect(page.getByRole('link', { name: 'Abrigo' })).toBeVisible()

    // Pelo menos uma seção da landing visível
    await expect(page.getByRole('heading', { name: /Adote um amigo/i })).toBeVisible()
  })

  test('navega para /adocao pelo link do Header', async ({ page }) => {
    await page.goto(`${BASE}/`)

    // Clica no link de Adoção do menu
    await page.getByRole('link', { name: 'Adoção' }).first().click()
    await page.waitForURL(`**${BASE}/adocao`)

    await expect(page.getByRole('heading', { name: 'Adoção' })).toBeVisible()
  })

  test('abre modal de detalhes do cão seed e exibe CTA de adoção', async ({ page }) => {
    await page.goto(`${BASE}/adocao`)

    // Aguarda o cão seed aparecer (banco local via Supabase)
    const dogCard = page.getByText('Rex E2E')
    await expect(dogCard).toBeVisible({ timeout: 15_000 })

    // Clica no card para abrir o modal
    await dogCard.click()

    // Modal está visível com o nome do cão
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Rex E2E')).toBeVisible()

    // CTA presente: link para formulário ou botão desabilitado
    // (.env.test define VITE_ADOPTION_FORM_URL → exibe o link)
    const cta = dialog.getByRole('link', { name: 'Quero adotar' })
      .or(dialog.getByRole('button', { name: 'Formulário indisponível' }))
    await expect(cta).toBeVisible()
  })
})
