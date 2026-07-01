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
- [x] **F5-10** Admin: gerenciar produtos/números. · Pronto: itens CRUD. · Toca: pages/admin/events
- [x] **F5-11** Admin: marcar reserva paga / definir prazo. · Pronto: status muda. · Toca: pages/admin/events

## Fase 6 — Acabamento

- [x] **F6-01** Loading/empty/error states (Skeleton). · Pronto: sem telas vazias cruas.
- [x] **F6-02** Responsivo (mobile-first) revisado. · Pronto: ok em mobile/desktop.
- [x] **F6-03** Dark mode revisado em todas as telas. · Pronto: contraste ok.
- [x] **F6-04** SEO + favicon + meta. · Pronto: tags presentes.
- [x] **F6-05** Acessibilidade (alt, foco, contraste). · Pronto: navegável por teclado.
- [x] **F6-06** Auditoria final de RLS. · Pronto: escrita anônima falha em tudo.

## Fase T — Testes

Backfill de cobertura para o que já existe (Fases 0–4) e infra para novas fases. **Não reabra tarefas das Fases 0–3 para adicionar testes** — o backfill é escopo desta fase. A partir de T-01 concluída, toda nova tarefa deve satisfazer o passo 6 da DoD (testes obrigatórios).

- [x] **T-01** Instalar e configurar infra de testes Vitest (Vitest + jsdom + @testing-library/react + user-event + jest-dom). · **Pronto quando:** `npm test` roda 1 teste-semente verde; scripts `test`, `test:watch`, `coverage` em `package.json`; `vitest.config.ts` com jsdom + globals + setupFiles; `src/test/setup.ts` importa jest-dom; `npm run build` passa. · **Toca:** `package.json`, `vitest.config.ts`, `tsconfig.node.json`, `src/test/setup.ts`, `src/test/smoke.test.ts`, `src/test/vitest.d.ts`, `AGENTS.md`, `TESTING.md`.
- [x] **T-02** Helpers de teste: `renderWithProviders` + MSW para dogs/stories. · **Pronto quando:** `src/test/render.tsx` com `renderWithProviders` (QueryClient novo por teste, retry off, MemoryRouter, ThemeProvider); MSW instalado; `src/test/msw/server.ts` e `src/test/msw/handlers.ts` com handlers base para `/rest/v1/dogs` e `/rest/v1/stories`; server plugado no `setup.ts` (listen/resetHandlers/close); exemplo de override em comentário; 1 teste-semente verde. · **Toca:** `package.json`, `src/test/render.tsx`, `src/test/msw/server.ts`, `src/test/msw/handlers.ts`, `src/test/setup.ts`, `src/test/render.test.tsx`, `TESTING.md`.
- [x] **T-03** Testes unitários puros — Camada 1 (format/form/sort de dogs e stories). · **Pronto quando:** `format.test.ts`, `form.test.ts` e `sort.test.ts` de `features/dogs` e `format.test.ts`/`form.test.ts` de `features/stories` cobrem 100% de branches; `sortDogs` extraída de `AdocaoPage.tsx` para `features/dogs/sort.ts`; 62 testes verdes; `npm run build` passa. · **Toca:** `features/dogs/sort.ts`, `AdocaoPage.tsx`, `features/dogs/format.test.ts`, `features/dogs/form.test.ts`, `features/dogs/sort.test.ts`, `features/stories/format.test.ts`, `features/stories/form.test.ts`, `TESTING.md`.
- [x] **T-04** Testes de componente — Camada 2 (`shared/ui` + componentes de dogs e stories). · **Pronto quando:** Button, Field, Modal, Skeleton; DogCard, DogDetailsModal; componentes de stories cobertos com estados loading/error/empty e interações básicas; `npm run test:run` verde. · **Toca:** `src/shared/ui/*.test.tsx`, `src/features/dogs/components/*.test.tsx`, `src/features/stories/components/*.test.tsx`, `TESTING.md`.
- [x] **T-05** Harness RLS pgTAP — Camada 4 (dogs + stories + Storage). · **Pronto quando:** `supabase test db supabase/tests` verde; `dogs_rls.test.sql` testa SELECT anon/auth, INSERT/UPDATE anônimo negado, INSERT/UPDATE autenticado permitido e DELETE bloqueado; `stories_rls.test.sql` idem para stories e FK `dog_id` (`on delete set null`); `storage_rls.test.sql` testa upload anônimo negado e autenticado permitido nos buckets `dogs`/`stories`; grants das roles de API permitem que RLS seja exercitada; script `test:rls` disponível. · **Toca:** `.gitignore`, `package.json`, `supabase/migrations/20260630000003_api_role_grants.sql`, `supabase/tests/README.md`, `supabase/tests/dogs_rls.test.sql`, `supabase/tests/stories_rls.test.sql`, `supabase/tests/storage_rls.test.sql`, `TESTING.md`, `DATA_MODEL.md`.
- [x] **T-06** E2E público — Camada 5 (landing, adoção, modal, CTA). · **Pronto quando:** `e2e/public.spec.ts` cobre landing carrega, navega para `/adocao` pelo Header, abre modal do cão seed, CTA de adoção visível; `npm run test:e2e` verde em Chromium. · **Toca:** `e2e/public.spec.ts`, `e2e/global-setup.ts`, `e2e/totp.ts`, `.env.test`, `playwright.config.ts`, `TESTING.md`.
- [x] **T-07** E2E admin/TOTP — Camada 5 (login + 2FA + acesso a /admin). · **Pronto quando:** `e2e/admin-auth.spec.ts` cobre login admin + verificação TOTP automatizada via `generateTOTP` (sem app externo, OTP seed capturado no setup via API) + acesso confirmado a `/admin`; `npm run test:e2e` verde. · **Toca:** `e2e/admin-auth.spec.ts`, `e2e/global-setup.ts`, `e2e/totp.ts`, `supabase/config.toml`, `supabase/migrations/20260630000004_service_role_grants.sql`, `src/pages/auth/VerifyTOTPPage.tsx`, `TESTING.md`.

# Fase D — Design System

Aplicar o `DESIGN_SYSTEM.md` (finalizado) sobre a estrutura já implementada. **Todo valor vem do DS — não inventar.** Ordem bottom-up: tokens → `shared/ui` → componentes de domínio → páginas → passada transversal.

Cada tarefa cita o bloco/IMG do DS que consome e satisfaz a Definition of Done do `AGENTS.md` (incl. passo 6 — testes). Reforço do invariante 5 do DS: **zero valor mágico no JSX** — cor/espaço/raio sempre via token.

> **Aviso sobre testes da Fase T:** várias tarefas desta fase reescrevem componentes que já têm teste (Button, DogCard, DogDetailsModal, StoryCard…). Testes que afirmam `className`/markup/estado vão precisar de ajuste. Isso **não é regressão de escopo alheio** — atualizar o teste junto e mantê-lo verde faz parte da DoD da própria tarefa D (passo 6).

Formato: `**ID** descrição · **Pronto quando:** critério · **Toca:** arquivos`.

## D.1 — Fundação de tokens

- [ ] **D-01** Cores semânticas (light+dark) → `tailwind.config` + CSS vars na raiz (DS §1.1). · **Pronto quando:** todos os tokens semânticos resolvem via classe Tailwind; `html.dark` troca os valores. · **Toca:** tailwind.config, src/index.css, DESIGN_SYSTEM.md
- [ ] **D-02** Contexto `on-brand` (3º fundo) via classe/data-attr (DS §2 "Três contextos de fundo"). · **Pronto quando:** container marcado on-brand adapta os tokens (`brand-tint` fill / `text-on-brand`) sem cor hardcoded. · **Toca:** tailwind.config, src/index.css
- [ ] **D-03** Tipografia: carregar Futura/Jost + família display/texto + escala + pesos + leading (DS §1.2). · **Pronto quando:** fontes carregam com fallback; escala aplicável por classe. · **Toca:** tailwind.config, src/index.css, index.html
- [ ] **D-04** Escala de espaçamento (DS §1.3). · **Pronto quando:** valores medidos viram `space-*` no config. · **Toca:** tailwind.config
- [ ] **D-05** Raios de borda `radius-sm/md/full` (DS §1.4). · **Pronto quando:** três raios aplicáveis por classe. · **Toca:** tailwind.config
- [ ] **D-06** Sombras = `none` (DS §1.5) + breakpoints mobile/desktop (§1.6). · **Pronto quando:** utilitários de sombra neutralizados; breakpoint desktop definido. · **Toca:** tailwind.config
- [ ] **D-07** Componente `Icon` (SVG `currentColor`) + importar set de ícones (DS §5). · **Pronto quando:** ícone renderiza herdando cor do contexto; set disponível por nome. · **Toca:** shared/ui/Icon, shared/assets/icons

## D.2 — shared/ui

- [ ] **D-08** `Button`: 4 variantes (`primary`/`secondary`/`dark`/`tint`) + estados (default/hover/active/focus/disabled) + tamanhos `md`/`sm` + 3 fundos (DS §3 Button). · **Pronto quando:** matriz de variantes/estados renderiza; on-brand inverte `primary` p/ tint. · **Toca:** shared/ui/Button
- [ ] **D-09** `Card` genérico (surface, raio, sem sombra). · **Pronto quando:** casca base reutilizável pelos cards de domínio. · **Toca:** shared/ui/Card
- [ ] **D-10** `Modal` + sistema de overlay em camadas (scrim `gray-900`/80% no fundo, painel ativo sem scrim — DS §2). · **Pronto quando:** abre/fecha com scrim correto. · **Toca:** shared/ui/Modal
- [ ] **D-11** `Field` (text/textarea) com tokens. · **Pronto quando:** integra react-hook-form + estilo do DS. · **Toca:** shared/ui/Field
- [ ] **D-12** `Skeleton` com tokens. · **Pronto quando:** placeholder usa `bg-surface`/`bg-base`. · **Toca:** shared/ui/Skeleton

## D.3 — Componentes de domínio

- [ ] **D-13** `TAG` (4 variantes, `radius-sm`, 3 fundos — DS §3 TAG). · **Pronto quando:** 4 variantes renderizam nos 3 fundos. · **Toca:** shared/ui/Tag
- [ ] **D-14** Lista de Seleção / `Select` (label externo + chevron `arrow-separate-vertical` + `radius-md`, 3 variantes). · **Pronto quando:** trigger renderiza; variante brand confirmada. · **Toca:** shared/ui/Select
- [ ] **D-15** Campo de Busca (`SearchInput`, lupa + 3 fundos). · **Pronto quando:** input renderiza nos 3 fundos. · **Toca:** shared/ui/SearchInput
- [ ] **D-16** Badge de Status (`adotado`/`falecido` — DS §3 Badge). · **Pronto quando:** ambas variantes + composição lado a lado. · **Toca:** features/dogs/components/StatusBadge
- [ ] **D-17** `Header` + `NavTab` + botão de tema. · **Pronto quando:** mobile = 2 linhas c/ scroll horizontal das abas; desktop = 1 linha, 6 abas sem overflow; aba ativa `gray-700`; ícone tema `sun-light`/`half-moon`. · **Toca:** shared/ui/Header, shared/ui/NavTab
- [ ] **D-18** Painel de Filtros (DS §3 FilterPanel). · **Pronto quando:** mobile empilhado + "Limpar" centralizado; desktop 3 colunas + "Limpar" à direita. · **Toca:** features/dogs/components/FilterPanel
- [ ] **D-19** Card (cão): capa 1:1, linha de TAGs `brand-dark`, nome `brand`, descrição `text-muted`, CTA full-width; grid 2 col mobile / 3 col desktop; dark ok. · **Pronto quando:** grid + anatomia batem com IMG-006/008/009. · **Toca:** features/dogs/components/DogCard
- [ ] **D-20** Card (história): capa ~4:3, sem TAGs, CTA "Conheça essa história"; **fundo por viewport** (mobile `bg-base` / desktop `bg-surface`); grid 2/3 col. · **Pronto quando:** anatomia bate com IMG-010/012. · **Toca:** features/stories/components/StoryCard
- [ ] **D-21** Modal detalhe do cão: mobile = carrossel horizontal (≤5 fotos 1:1) + rodapé `tint`+`primary`; desktop = split (galeria vertical à esquerda + conteúdo à direita); foto → lightbox AR original. · **Pronto quando:** ambos layouts batem com IMG-006/007/008. · **Toca:** features/dogs/components/DogDetailsModal
- [ ] **D-22** Modal de história: mesma anatomia, rodapé com botão único "Fechar essa história" (`primary`, largura compacta). · **Pronto quando:** bate com IMG-011/013. · **Toca:** features/stories/components/StoryModal
- [ ] **D-23** Card de produto / número de rifa. · **Pronto quando:** card renderiza no catálogo do evento com tokens. · **Toca:** features/events/components

## D.4 — Páginas

- [ ] **D-24** Landing: container de seções horizontais + seções (ícones informativos §5.5 + CTAs). · **Pronto quando:** seções renderizam com tokens/ícones. · **Toca:** pages/public/landing
- [ ] **D-25** Adoção: aplicar grid + Painel de Filtros + Card + Modal. · **Pronto quando:** página usa componentes do DS. · **Toca:** pages/public/adocao
- [ ] **D-26** Histórias: aplicar grid + Card + Modal. · **Pronto quando:** página usa componentes do DS. · **Toca:** pages/public/historias
- [ ] **D-27** Eventos/Recãopensa: evento ativo + passados com tokens/componentes. · **Pronto quando:** página usa componentes do DS. · **Toca:** pages/public/eventos
- [ ] **D-28** Admin: aplicar tokens + Button Menor (mapa ação→ícone §5.2) + componentes nos CRUDs. · **Pronto quando:** telas admin usam tokens e ícones corretos. · **Toca:** pages/admin/*

## D.5 — Passada transversal

- [ ] **D-29** Garantir os 3 contextos de fundo (light/dark/on-brand) em cada componente. · **Pronto quando:** nenhum componente quebra contraste em nenhum dos 3. · **Toca:** shared/ui, features/*/components
- [ ] **D-30** Responsivo mobile-first revisado em todas as telas. · **Pronto quando:** ok em mobile/desktop nos breakpoints do DS. · **Toca:** todas as páginas
- [ ] **D-31** Auditoria "zero valor mágico": varredura por hex/px soltos no JSX. · **Pronto quando:** nenhum valor de cor/espaço/raio fora de token. · **Toca:** — (revisão global)

## Débitos técnicos / correções

- [x] **CT-01** Corrigir callback de convite admin. · Pronto: link de convite cria sessão e redireciona para `/admin/definir-senha`. · Toca: app/auth
- [x] **CT-02** Corrigir env dos workflows de CI. · Pronto: jobs `Unit & Component` e `RLS & E2E` recebem vars locais necessárias sem depender de `.env` ou secrets manuais. · Toca: .github/workflows/test.yml + TESTING/PROGRESS
- [x] **CT-03** Reduzir gatilhos do CI. · Pronto: `test.yml` roda só em PR para `main` e via `workflow_call` do deploy; push em branch comum não dispara testes. · Toca: .github/workflows/test.yml + TESTING/PROGRESS

---

## Dívidas / decisões em aberto
(decisões fixadas vão para `PROGRESS.md › Decisões fixadas`)

- Sorteio da rifa: como escolher/divulgar ganhador?
