# TESTING.md

Estratégia de testes do projeto. Fonte de referência para agentes e humanos antes de escrever qualquer teste.
A implementação real vive em `src/test/`, `supabase/tests/` e `e2e/`. Este documento define camadas, ferramentas e o que cobrir — é o equivalente do `DATA_MODEL.md` para testes.

## Como usar

- Status de cobertura: `🟢 coberto` · `🟡 parcial` · `⬜ pendente`.
- **Fases 0–3** foram fechadas antes desta política e **não devem ser reabertas** — o backfill é responsabilidade da Fase T.
- A partir de T-01 concluída, toda tarefa nova exige testes como parte da DoD (ver `AGENTS.md`).

---

## Ferramentas

| Ferramenta | Camada(s) | Propósito |
|---|---|---|
| **Vitest** | 1, 2, 3 | Runner, assertions, watch mode, coverage (`@vitest/coverage-v8`) |
| **jsdom** | 2, 3 | Ambiente DOM sintético para componentes React no Vitest |
| **@testing-library/react** | 2, 3 | Render + queries semanticamente corretas |
| **@testing-library/user-event** | 2, 3 | Simulação de interações reais do usuário (clique, digitação…) |
| **@testing-library/jest-dom** | 2, 3 | Matchers DOM extras (`toBeVisible`, `toHaveValue`, `toBeDisabled`…) |
| **MSW** | 3 | Intercepta requisições ao Supabase (REST + Auth) sem tocar o banco real |
| **Supabase CLI local** | 4 | Instância local real de Postgres (`supabase start`) |
| **pgTAP** | 4 | Testes SQL de RLS e schema rodando no banco local |
| **Playwright** | 5 | Browser real (Chromium/Firefox/WebKit) contra o dev server local |

---

## Camadas

### Camada 1 — Unitário puro

Funções que **não dependem de DOM, React ou rede**.

**O que testar:** transformadores de dados, helpers, `format.ts`, validadores zod, utilitários de `shared/lib`.
**O que não testar:** componentes, hooks, queries ao Supabase.

### Camada 2 — Componente

Componentes React em isolamento com `@testing-library/react` + jsdom.

**O que testar:** renderização condicional, estados (loading/error/empty/default), interações de UI (clique, input, teclado), props opcionais, acessibilidade básica (aria, role, foco).
**O que não testar:** integração com Supabase real — quando houver chamadas à API, use MSW (Camada 3).

### Camada 3 — Integração / API (MSW)

Hooks TanStack Query + camada de API com **Supabase interceptado** pelo MSW.

**O que testar:** hooks `useX`, mutations e invalidação de cache, tratamento de erro de rede, fluxos de formulário que disparam mutations.
**O que não testar:** SQL real, RLS, Storage — esses ficam na Camada 4.

### Camada 4 — Banco / RLS (Supabase local + pgTAP)

RLS policies e constraints testados diretamente em SQL, contra instância local real.

**O que testar:** SELECT público retorna só o permitido; INSERT/UPDATE anônimo falha; FKs e constraints (`CHECK`, `NOT NULL`); triggers de `updated_at`; constraint `CHECK` de reservas (`product_id` XOR `raffle_number_id`).
**O que não testar:** lógica de front.

### Camada 5 — E2E (Playwright)

Fluxos completos num browser real contra o dev server local.

**O que testar:** happy path do visitante (ver cães, abrir modal, histórias); login admin com TOTP (OTP seed ou bypass de teste); CRUD básico do admin.
**O que não testar:** RLS (coberta na Camada 4) — Playwright foca em fluxo de usuário.

---

## Localização de arquivos

```
src/
  test/                              # utilitários compartilhados de teste
    setup.ts                         # jest-dom + MSW server lifecycle + mock matchMedia
    render.tsx                       # renderWithProviders (QueryClient/MemoryRouter/ThemeProvider)
    render.test.tsx                  # teste-semente de render + MSW
    vitest.d.ts                      # triple-slash reference para vitest/globals
    msw/
      server.ts                      # MSW node server (Vitest)
      handlers.ts                    # handlers base: /rest/v1/dogs e /rest/v1/stories
    factories/                       # fábricas de objetos de teste (pendente T-03+)
      dog.ts
      story.ts
  features/
    dogs/
      format.test.ts                 # Camada 1
      components/
        DogCard.test.tsx             # Camada 2
        DogDetailsModal.test.tsx     # Camada 2
    stories/
      format.test.ts                 # Camada 1
      components/
        *.test.tsx                   # Camada 2
  shared/
    ui/
      Button.test.tsx                # Camada 2
      Field.test.tsx                 # Camada 2
      Modal.test.tsx                 # Camada 2
supabase/
  tests/
    README.md                        # como rodar testes RLS locais
    dogs_rls.test.sql                # Camada 4
    stories_rls.test.sql             # Camada 4
    storage_rls.test.sql             # Camada 4
e2e/
  global-setup.ts                    # seed cão + criar usuário admin + enroll TOTP
  totp.ts                            # geração TOTP RFC 6238 (node:crypto, sem dep externa)
  public.spec.ts                     # Camada 5 — visitante (T-06)
  admin-auth.spec.ts                 # Camada 5 — admin/TOTP (T-07)
  .e2e-state.json                    # secret TOTP salvo pelo setup (gitignored)
```

**Regra de localização:** `*.test.ts(x)` ficam **ao lado** do código que testam (co-located). Utilitários compartilhados de teste vão em `src/test/`. Exceções: SQL/RLS em `supabase/tests/`; E2E em `e2e/`.

---

## Como rodar

```bash
# Camadas 1–3 (unitário + componente + integração/MSW)
npm test                 # uma vez — CI / verificação (vitest run)
npm run test:watch       # modo watch — desenvolvimento
npm run coverage         # com relatório de cobertura HTML

# Camada 4 — requer Supabase CLI instalado
npx supabase start       # sobe instância local
npx supabase test db     # roda supabase/tests/*.test.sql com pgTAP
npm run test:rls         # equivalente: npx supabase test db supabase/tests

# Camada 5 — E2E Playwright (contra Supabase LOCAL — nunca produção)
# Pré-requisito: npx supabase start + npx supabase db reset (migrations + grants)
# Copie .env.test.example → .env.test e preencha com os valores de `npx supabase status`
npx playwright install chromium   # primeira vez: baixa browser
npm run test:e2e                  # build --mode test + global-setup + 4 specs
npm run e2e:ui                    # modo interativo Playwright (requer build prévio)
```

> **E2E roda SOMENTE contra o Supabase local.** O `global-setup.ts` usa a
> `E2E_SUPABASE_SERVICE_ROLE_KEY` do `.env.test` (gitignored) para criar o
> usuário de teste e fazer enroll TOTP via API — sem app externo. O secret
> TOTP gerado é salvo em `e2e/.e2e-state.json` (gitignored) e consumido
> pelos specs. **Nunca aponte `.env.test` para a instância de produção.**

---

## Cobertura por feature

Atualizado a cada tarefa. Marque `🟢` ao cobrir, `🟡` se parcial.

| Feature | Unitário | Componente | Integração/MSW | RLS/banco | E2E | Observação |
|---|---|---|---|---|---|---|
| `shared/ui` (Button, Card, Modal, Field, Skeleton) | — | 🟢 | — | — | — | T-04 |
| `features/dogs` — format/utils/sort | 🟢 | — | — | — | — | 100% — T-03 |
| `features/dogs` — componentes | — | 🟢 | ⬜ | — | — | T-04 |
| `features/dogs` — RLS | — | — | — | 🟢 | — | dogs + bucket `dogs` — T-05 |
| `features/dogs` — E2E público | — | — | — | — | 🟢 | T-06: landing+modal+CTA |
| `features/dogs` — E2E admin | — | — | — | — | 🟢 | T-07: login+TOTP+/admin |
| `features/stories` — format/utils | 🟢 | — | — | — | — | 100% — T-03 |
| `features/stories` — componentes | — | ⬜ | ⬜ | — | — | backfill T-04 |
| `features/stories` — RLS | — | — | — | 🟢 | — | stories + bucket `stories` — T-05 |
| `features/stories` — E2E público | — | — | — | — | 🟡 | coberto indiretamente (landing) |
| `features/auth` — AdminGuard | — | 🟢 | — | — | — | T-04 (módulos mockados) |
| `features/auth` — E2E admin/TOTP | — | — | — | — | 🟢 | T-07: login+2FA+/admin |
| `pages/public/landing` — DoacaoSection | — | 🟢 | — | — | — | T-04 |
| `features/events` / `reservations` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | escrever junto c/ Fase 5 |

### Infra de teste

| Utilitário | Status | Nota |
|---|---|---|
| `src/test/render.tsx` — `renderWithProviders` | 🟢 | QueryClient/MemoryRouter/ThemeProvider; novo por teste |
| MSW server + handlers base (dogs, stories) | 🟢 | `src/test/msw/server.ts`, `handlers.ts` |
| Setup global (jest-dom, MSW lifecycle, matchMedia mock) | 🟢 | `src/test/setup.ts` |
| pgTAP RLS harness | 🟢 | `supabase/tests/*.test.sql`; roda com `npm run test:rls` |
