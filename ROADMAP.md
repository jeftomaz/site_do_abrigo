# ROADMAP.md

Tarefas **atômicas** (uma responsabilidade cada). Marque `[x]` ao concluir, seguindo a Definition of Done do `AGENTS.md`.
Formato: `**ID** descrição · **Pronto quando:** critério · **Toca:** arquivos`.
Tarefa ampla demais? Quebre em `ID a/b/c` antes de codar.

## Fase 0 — Fundação

- [x] **F0-01** Criar projeto Vite (React+TS) + Tailwind. · Pronto: `npm run dev` abre página em branco. · Toca: raiz, vite.config.ts
- [x] **F0-02** Criar projeto Supabase; pegar URL + publishable key (`sb_publishable_…`). · Pronto: credenciais em mãos. · Toca: —
- [x] **F0-03** `.env.example` + `.env` com `VITE_SUPABASE_URL/PUBLISHABLE_KEY`. · Pronto: vars carregam. · Toca: .env*
- [x] **F0-04** `shared/lib/supabase.ts` (client único). · Pronto: client importável sem erro. · Toca: shared/lib/supabase.ts
- [x] **F0-05** `vite.config.ts` `base:'/<repo>/'`. · Pronto: build referencia base certa. · Toca: vite.config.ts
- [x] **F0-06** `public/404.html` (fallback SPA). · Pronto: rota direta não dá 404 no Pages. · Toca: public/404.html
- [x] **F0-07** GitHub Action de deploy. · Pronto: push publica no Pages. · Toca: .github/workflows

## Fase 1 — Esqueleto compartilhado

- [x] **F1-01** `app/router.tsx` rota `/`. · Pronto: home renderiza. · Toca: app/router.tsx
- [x] **F1-02** Rota `/admin` lazy. · Pronto: admin só baixa ao acessar. · Toca: app/router.tsx
- [x] **F1-03** `app/providers.tsx` com QueryClient. · Pronto: useQuery funciona. · Toca: app/providers.tsx
- [x] **F1-04** Auth: login admin + **signup público DESABILITADO** (admin só por convite). · Pronto: não-convidado não cria conta; convidado loga. · Toca: features/auth + config Supabase
- [x] **F1-05** MFA/2FA: enrolar TOTP (app autenticador); confirmar suporte a código por e-mail. · Pronto: login exige 2º fator. · Toca: features/auth + config Supabase + DATA_MODEL
- [x] **F1-06** Sessão longa + re-auth por inatividade (config refresh token/JWT; **confirmar viabilidade no free tier**). · Pronto: sessão persiste; pede 2º fator só após X dias sem acesso. · Toca: config Supabase + features/auth
- [x] **F1-07** Guard da rota `/admin`. · Pronto: sem sessão válida → redireciona. · Toca: app/router.tsx
- [x] **F1-08** Theme provider (light/dark). · Pronto: alterna tema. · Toca: app/providers.tsx
- [x] **F1-09** `shared/ui/Button`. · Pronto: variantes básicas renderizam. · Toca: shared/ui
- [x] **F1-10** `shared/ui/Card`. · Pronto: usado em 1 tela. · Toca: shared/ui
- [x] **F1-11** `shared/ui/Modal`. · Pronto: abre/fecha. · Toca: shared/ui
- [x] **F1-12** `shared/ui/Field`. · Pronto: integra react-hook-form. · Toca: shared/ui
- [x] **F1-13** `shared/ui/Skeleton`. · Pronto: placeholder de loading. · Toca: shared/ui
- [x] **F1-14** Header (âncoras landing + links de página). · Pronto: navegação completa. · Toca: shared/ui ou app

## Fase 2 — Landing page (público)

- [x] **F2-01** Layout da landing (container de seções horizontais). · Pronto: scaffold visível. · Toca: pages/public/landing
- [x] **F2-02** Seção Doação. · Pronto: âncora + conteúdo. · Toca: landing/sections
- [x] **F2-03** Seção Adoção (teaser → /adocao). · Pronto: link funciona. · Toca: landing/sections
- [x] **F2-04** Seção Histórias (teaser). · Pronto: idem. · Toca: landing/sections
- [x] **F2-05** Seção Eventos (teaser). · Pronto: idem. · Toca: landing/sections

## Fase 3 — Adoção (cães)

- [x] **F3-01** Migration `dogs` + enum `dog_status`. · Pronto: tabela criada. · Toca: supabase/migrations + DATA_MODEL
- [x] **F3-02** RLS `dogs` (SELECT público só available; escrita autenticada). · Pronto: escrita anônima falha. · Toca: migrations + DATA_MODEL
- [x] **F3-03** Bucket Storage `dogs` + policy. · Pronto: upload autenticado, leitura pública. · Toca: Supabase + DATA_MODEL
- [x] **F3-04** `features/dogs/{api,hooks,types}`. · Pronto: listar cães available. · Toca: features/dogs
- [x] **F3-05** Card do cão (público). · Pronto: grid de cards. · Toca: features/dogs/components
- [x] **F3-06** Modal de detalhes + botão → Google Forms. · Pronto: expande e linka. · Toca: features/dogs/components
- [x] **F3-07** Ordenação (porte/idade…). · Pronto: reordena no cliente. · Toca: pages/public/adocao
- [x] **F3-08** Admin: listar cães (todos os status). · Pronto: tabela/lista admin. · Toca: pages/admin/dogs
- [x] **F3-09** Admin: criar cão. · Pronto: novo cão aparece. · Toca: pages/admin/dogs
- [x] **F3-10** Admin: editar cão. · Pronto: edição persiste. · Toca: pages/admin/dogs
- [x] **F3-11** Admin: upload de fotos. · Pronto: fotos salvam no bucket. · Toca: pages/admin/dogs
- [x] **F3-12** Admin: marcar adotado/falecido. · Pronto: some do público. · Toca: pages/admin/dogs

## Fase 4 — Histórias

- [x] **F4-01** Migration `stories` + RLS. · Pronto: tabela + leitura pública. · Toca: migrations + DATA_MODEL
- [x] **F4-02** Bucket `stories` + policy. · Pronto: idem dogs. · Toca: Supabase + DATA_MODEL
- [x] **F4-03** `features/stories/{api,hooks,types}`. · Pronto: listar histórias. · Toca: features/stories
- [x] **F4-04** Público: página de listagem. · Pronto: histórias renderizam. · Toca: pages/public/historias
- [x] **F4-05** Admin: criar história. · Pronto: nova história aparece. · Toca: pages/admin/stories
- [x] **F4-06** Admin: editar história. · Pronto: edição persiste. · Toca: pages/admin/stories

## Fase 5 — Eventos / Recãopensa

- [x] **F5-01** Migrations `events`+`products`+`raffle_numbers`+`reservations` + enums. · Pronto: tabelas criadas. · Toca: migrations + DATA_MODEL
- [x] **F5-02** Garantir 1 evento ativo (índice/regra `is_active`). · Pronto: 2º ativo falha. · Toca: migrations + DATA_MODEL
- [x] **F5-03** RLS de todas (INSERT reserva público; resto autenticado). · Pronto: políticas testadas. · Toca: migrations + DATA_MODEL
- [x] **F5-04** Query de disponibilidade (livre se sem paid/pending válida). · Pronto: item reservado some. · Toca: features/events/api + DATA_MODEL
- [x] **F5-05** pg_cron p/ cancelar pending expiradas. · Pronto: job cancela após prazo. · Toca: Supabase + DATA_MODEL
- [x] **F5-06** `features/events/{api,hooks,types}`. · Pronto: ler evento ativo + passados. · Toca: features/events
- [x] **F5-07** Público: ver evento ativo + passados. · Pronto: lista renderiza. · Toca: pages/public/eventos
- [x] **F5-08** Público: reservar item/número → gerar PIX + instrução comprovante. · Pronto: reserva criada. · Toca: pages/public/eventos
- [x] **F5-09** Admin: criar/editar evento. · Pronto: evento gerenciável. · Toca: pages/admin/events
- [ ] **F5-10** Admin: gerenciar produtos/números. · Pronto: itens CRUD. · Toca: pages/admin/events
- [ ] **F5-11** Admin: marcar reserva paga / definir prazo. · Pronto: status muda. · Toca: pages/admin/events

## Fase 6 — Acabamento

- [ ] **F6-01** Loading/empty/error states (Skeleton). · Pronto: sem telas vazias cruas.
- [ ] **F6-02** Responsivo (mobile-first) revisado. · Pronto: ok em mobile/desktop.
- [ ] **F6-03** Dark mode revisado em todas as telas. · Pronto: contraste ok.
- [ ] **F6-04** SEO + favicon + meta. · Pronto: tags presentes.
- [ ] **F6-05** Acessibilidade (alt, foco, contraste). · Pronto: navegável por teclado.
- [ ] **F6-06** Auditoria final de RLS. · Pronto: escrita anônima falha em tudo.

## Fase T — Testes

Backfill de cobertura para o que já existe (Fases 0–4) e infra para novas fases. **Não reabra tarefas das Fases 0–3 para adicionar testes** — o backfill é escopo desta fase. A partir de T-01 concluída, toda nova tarefa deve satisfazer o passo 6 da DoD (testes obrigatórios).

- [x] **T-01** Instalar e configurar infra de testes Vitest (Vitest + jsdom + @testing-library/react + user-event + jest-dom). · **Pronto quando:** `npm test` roda 1 teste-semente verde; scripts `test`, `test:watch`, `coverage` em `package.json`; `vitest.config.ts` com jsdom + globals + setupFiles; `src/test/setup.ts` importa jest-dom; `npm run build` passa. · **Toca:** `package.json`, `vitest.config.ts`, `tsconfig.node.json`, `src/test/setup.ts`, `src/test/smoke.test.ts`, `src/test/vitest.d.ts`, `AGENTS.md`, `TESTING.md`.
- [x] **T-02** Helpers de teste: `renderWithProviders` + MSW para dogs/stories. · **Pronto quando:** `src/test/render.tsx` com `renderWithProviders` (QueryClient novo por teste, retry off, MemoryRouter, ThemeProvider); MSW instalado; `src/test/msw/server.ts` e `src/test/msw/handlers.ts` com handlers base para `/rest/v1/dogs` e `/rest/v1/stories`; server plugado no `setup.ts` (listen/resetHandlers/close); exemplo de override em comentário; 1 teste-semente verde. · **Toca:** `package.json`, `src/test/render.tsx`, `src/test/msw/server.ts`, `src/test/msw/handlers.ts`, `src/test/setup.ts`, `src/test/render.test.tsx`, `TESTING.md`.
- [x] **T-03** Testes unitários puros — Camada 1 (format/form/sort de dogs e stories). · **Pronto quando:** `format.test.ts`, `form.test.ts` e `sort.test.ts` de `features/dogs` e `format.test.ts`/`form.test.ts` de `features/stories` cobrem 100% de branches; `sortDogs` extraída de `AdocaoPage.tsx` para `features/dogs/sort.ts`; 62 testes verdes; `npm run build` passa. · **Toca:** `features/dogs/sort.ts`, `AdocaoPage.tsx`, `features/dogs/format.test.ts`, `features/dogs/form.test.ts`, `features/dogs/sort.test.ts`, `features/stories/format.test.ts`, `features/stories/form.test.ts`, `TESTING.md`.
- [x] **T-04** Testes de componente — Camada 2 (`shared/ui` + componentes de dogs e stories). · **Pronto quando:** Button, Field, Modal, Skeleton; DogCard, DogDetailsModal; componentes de stories cobertos com estados loading/error/empty e interações básicas; `npm run test:run` verde. · **Toca:** `src/shared/ui/*.test.tsx`, `src/features/dogs/components/*.test.tsx`, `src/features/stories/components/*.test.tsx`, `TESTING.md`.
- [x] **T-05** Harness RLS pgTAP — Camada 4 (dogs + stories + Storage). · **Pronto quando:** `supabase test db supabase/tests` verde; `dogs_rls.test.sql` testa SELECT anon/auth, INSERT/UPDATE anônimo negado, INSERT/UPDATE autenticado permitido e DELETE bloqueado; `stories_rls.test.sql` idem para stories e FK `dog_id` (`on delete set null`); `storage_rls.test.sql` testa upload anônimo negado e autenticado permitido nos buckets `dogs`/`stories`; grants das roles de API permitem que RLS seja exercitada; script `test:rls` disponível. · **Toca:** `.gitignore`, `package.json`, `supabase/migrations/20260630000003_api_role_grants.sql`, `supabase/tests/README.md`, `supabase/tests/dogs_rls.test.sql`, `supabase/tests/stories_rls.test.sql`, `supabase/tests/storage_rls.test.sql`, `TESTING.md`, `DATA_MODEL.md`.
- [x] **T-06** E2E público — Camada 5 (landing, adoção, modal, CTA). · **Pronto quando:** `e2e/public.spec.ts` cobre landing carrega, navega para `/adocao` pelo Header, abre modal do cão seed, CTA de adoção visível; `npm run test:e2e` verde em Chromium. · **Toca:** `e2e/public.spec.ts`, `e2e/global-setup.ts`, `e2e/totp.ts`, `.env.test`, `playwright.config.ts`, `TESTING.md`.
- [x] **T-07** E2E admin/TOTP — Camada 5 (login + 2FA + acesso a /admin). · **Pronto quando:** `e2e/admin-auth.spec.ts` cobre login admin + verificação TOTP automatizada via `generateTOTP` (sem app externo, OTP seed capturado no setup via API) + acesso confirmado a `/admin`; `npm run test:e2e` verde. · **Toca:** `e2e/admin-auth.spec.ts`, `e2e/global-setup.ts`, `e2e/totp.ts`, `supabase/config.toml`, `supabase/migrations/20260630000004_service_role_grants.sql`, `src/pages/auth/VerifyTOTPPage.tsx`, `TESTING.md`.

## Débitos técnicos / correções

- [x] **CT-01** Corrigir callback de convite admin. · Pronto: link de convite cria sessão e redireciona para `/admin/definir-senha`. · Toca: app/auth

---

## Dívidas / decisões em aberto
(decisões fixadas vão para `PROGRESS.md › Decisões fixadas`)

- Sorteio da rifa: como escolher/divulgar ganhador?
