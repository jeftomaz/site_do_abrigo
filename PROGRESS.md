# PROGRESS.md

Registro **vivo** do desenvolvimento. Atualizado ao fim de **cada** tarefa (ver Definition of Done no `AGENTS.md`).
Quem retoma o projeto lê primeiro o bloco **Atual**, depois **Decisões fixadas**, depois o **Log** (mais recente no topo).

## Atual

- **Fase:** T — Testes ✓ (concluída)
- **Próxima tarefa:** F5-01 (Fase 5 — Eventos)
- **Fase concluída:** Fase T — Testes ✓ · Fase 4 — Histórias ✓ · Fase 3 — Adoção (cães) ✓ · Fase 2 — Landing page ✓ · Fase 1 — Esqueleto compartilhado ✓
- **Bloqueios:** nenhum.

## Decisões fixadas

Decisões já tomadas, para não reabrir. Quando uma "dívida" do ROADMAP é resolvida, ela vem para cá.

| Data | Tema | Decisão |
|---|---|---|
| 2026-06-28 | Chaves Supabase | Front usa **publishable key** (`sb_publishable_…`); **secret key nunca** entra no bundle (site é estático). Escrita admin = publishable + sessão autenticada via RLS. |
| 2026-06-28 | Docs de orientação | Versionados no repo. Só segredos ficam fora (`.env` gitignored; commitar `.env.example`). |
| 2026-06-28 | Infra existente | Repo e projeto Supabase **já criados**; banco **vazio**. F0 não recria — só configura e popula. |
| 2026-06-28 | CSS framework | Usar **Tailwind CSS** como framework de estilos do app. |
| 2026-06-29 | Representação de `age` | Campo `birth_year` (smallint, nullable); UI calcula idade nos dois sentidos (ano→idade e idade→ano estimado). |
| 2026-06-29 | `item_ref` da reserva | Duas colunas nuláveis: `product_id` e `raffle_number_id`; CHECK constraint garante exatamente uma preenchida. |
| 2026-06-29 | Estratégia de imagens | Supabase Storage; upload feito pelo painel admin do site. |
| 2026-06-29 | Geração do PIX | Seção informativa: chave PIX estática (`abrigodamarcia@gmail.com`) exibida com botão copiar. Sem QR Code nem geração dinâmica. |
| 2026-06-29 | Escopo da Doação | Só informativo — texto + chave PIX copiável. |
| 2026-06-29 | Campo `size` de cão | `text` livre (sem enum); validação de valores aceitos fica na UI. |
| 2026-06-29 | Convite admin | Callback `type=invite` é tratado manualmente pelo app: o client não consome o hash automaticamente; `InviteHandler` cria a sessão e manda para `/admin/definir-senha`. |
| — | Sorteio da rifa | _pendente — como escolher/divulgar ganhador?_ |

## Log

Mais recente no topo. Uma entrada por tarefa concluída. Mantenha curto.

### Modelo (copiar)

> ### AAAA-MM-DD — `ID` título
> - **Feito:** o que foi entregue (1–3 linhas).
> - **Decisões:** o que foi resolvido no caminho (ou "nenhuma").
> - **Arquivos:** caminhos tocados.
> - **Docs:** quais docs foram atualizados (ROADMAP marcado; DATA_MODEL/DESIGN_SYSTEM se aplicável).

<!-- entradas reais abaixo -->

### 2026-06-30 — `CI` GitHub Actions — workflow de testes e deploy guardado

- **Feito:** criado `.github/workflows/test.yml` com dois jobs: `unit` (Vitest + coverage, roda em todo push/PR) e `integration` (RLS pgTAP + Playwright E2E, roda apenas em PR e antes do deploy). O job `integration` usa `supabase/setup-cli`, sobe o Supabase local com `supabase start` + `supabase db reset`, exporta `ANON_KEY`/`SERVICE_ROLE_KEY` via `supabase status -o env` e os mapeia para as variáveis `VITE_*` / `E2E_*` esperadas pelo app. Credenciais do usuário de teste E2E (`E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`) vêm de GitHub Secrets. Relatório do Playwright é publicado como artefato em caso de falha. `deploy.yml` atualizado: chama `test.yml` via `workflow_call` (`secrets: inherit`) e o job `deploy` declara `needs: test` — deploy só ocorre se todos os testes passarem.
- **Decisões:** `test.yml` expõe `workflow_call` para ser reutilizado pelo deploy sem duplicar YAML; `push: branches-ignore: [main]` evita double-run no merge (o deploy.yml já dispara os testes). Job `integration` condicionado a `pull_request` ou `workflow_call` para não rodar Supabase em pushes de branches de feature. Secrets de produção (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) permanecem apenas no `deploy.yml`; chaves locais do Supabase são derivadas dinamicamente de `supabase status -o env` no CI.
- **Arquivos:** `.github/workflows/test.yml` (novo), `.github/workflows/deploy.yml`, `TESTING.md`, `PROGRESS.md`.
- **Docs:** `TESTING.md` ganhou seção "CI" com tabela de triggers, descrição dos jobs e tabela de secrets; `PROGRESS.md` atualizado.

### 2026-06-30 — `T-06` e `T-07` E2E Playwright — Camada 5

- **Feito:** instalado `@playwright/test` + `dotenv`; `playwright.config.ts` com `webServer` subindo `npm run preview` (porta 4173) e `baseURL: 'http://localhost:4173'`; `e2e/global-setup.ts` conecta ao Supabase local com `SERVICE_ROLE_KEY`, faz upsert do cão seed (`Rex E2E`, status `available`), recria o usuário admin de teste (`admin-e2e@abrigo.test`), faz enroll TOTP via `mfa.enroll()` e verifica o fator via `mfa.challenge/verify()`, salva o secret TOTP em `e2e/.e2e-state.json` (gitignored); `e2e/totp.ts` implementa TOTP RFC 6238 com `node:crypto` (sem dep externa); `e2e/public.spec.ts` (T-06): 3 casos — landing carrega, navega para /adocao pelo Header, abre modal do cão seed e exibe CTA de adoção; `e2e/admin-auth.spec.ts` (T-07): login admin → redirecionado para /admin/verify → código TOTP gerado localmente com janela diferente do setup → /admin com "Painel Admin". Scripts `test:e2e` (`vite build --mode test && npx playwright test`) e `e2e:ui` adicionados. `vitest.config.ts` excluí `e2e/**`. 4/4 E2E verdes + 104 unitários verdes + `tsc -b` limpo.
- **Decisões:** TOTP implementado com `node:crypto` (sem otplib — v13 mudou API incompatível e v12 não seria mantida); geração do código adiada no teste até uma janela TOTP diferente do setup para evitar replay; `supabase/config.toml` criado para habilitar `[auth.mfa.totp]` no local (ausência impedia enroll); migration `20260630000004_service_role_grants.sql` adiciona `SELECT/INSERT/UPDATE/DELETE` para `service_role` nas tabelas de domínio (mesmo grant presente em Supabase Cloud por padrão; faltava no local); `VerifyTOTPPage` corrigida para desabilitar o botão Verificar enquanto `factorId` não carregou (melhoria de UX + torna o E2E determinístico); `.env.test.example` commitado; `.env.test` e `.e2e-state.json` gitignored.
- **Arquivos:** `playwright.config.ts`, `e2e/global-setup.ts`, `e2e/totp.ts`, `e2e/public.spec.ts`, `e2e/admin-auth.spec.ts`, `.env.test.example`, `.env.test`, `supabase/config.toml`, `supabase/migrations/20260630000004_service_role_grants.sql`, `src/pages/auth/VerifyTOTPPage.tsx`, `package.json`, `vitest.config.ts`, `tsconfig.node.json`, `.gitignore`, `AGENTS.md`, `ROADMAP.md`, `TESTING.md`, `PROGRESS.md`.
- **Docs:** `ROADMAP.md` T-06 e T-07 marcados; `TESTING.md` cobertura E2E atualizada, comandos revisados, aviso "nunca produção"; `AGENTS.md` comandos test:e2e e e2e:ui; `PROGRESS.md` Fase T concluída; `TESTING.md` localização de arquivos atualizada.
- **Verificação:** `npm run build` passou; `npm test` verde (104 testes, 13 arquivos); `npx playwright test` 4/4 verde (3 specs T-06 + 1 spec T-07) em Chromium.

### 2026-06-30 — `T-05` Harness RLS pgTAP — Camada 4
- **Feito:** criado harness pgTAP em `supabase/tests/` com README curto; `dogs_rls.test.sql` cobre SELECT anon/auth, INSERT anon negado, UPDATE anon sem efeito, INSERT/UPDATE autenticado OK e DELETE negado; `stories_rls.test.sql` cobre leitura pública, escrita apenas autenticada, DELETE negado e FK `dog_id on delete set null`; `storage_rls.test.sql` cobre upload anônimo negado e upload autenticado OK nos buckets `dogs`/`stories`. Adicionado `npm run test:rls`.
- **Decisões:** adicionada migration de grants para roles `anon`/`authenticated` nas tabelas/bucket necessários, para que os testes e a API exercitem RLS em vez de falharem antes por privilégio SQL. Testes de Storage não fazem DELETE direto em `storage.objects`, pois o Supabase local protege a tabela contra remoção direta.
- **Arquivos:** `.gitignore`, `package.json`, `supabase/migrations/20260630000003_api_role_grants.sql`, `supabase/tests/README.md`, `supabase/tests/dogs_rls.test.sql`, `supabase/tests/stories_rls.test.sql`, `supabase/tests/storage_rls.test.sql`, `src/shared/ui/Button.test.tsx`, `ROADMAP.md`, `PROGRESS.md`, `TESTING.md`, `DATA_MODEL.md`.
- **Docs:** `ROADMAP.md` T-05 marcado; `TESTING.md` marcou RLS de dogs/stories como 🟢; `DATA_MODEL.md` registrou grants e testes RLS/Storage; `PROGRESS.md` atualizado.
- **Verificação:** `npm run build` passou; `npm test` passou (104 testes); `npx supabase start` + `npx supabase db reset` OK; `npm run test:rls` passou (3 arquivos, 26 asserts).

### 2026-06-30 — `T-04` Testes de componente — Camada 2
- **Feito:** 6 arquivos de teste criados, 42 novos casos (total 104 testes verdes). `Button.test.tsx` (5 casos: 4 variantes, isLoading desabilita + exibe spinner, disabled, onClick, disabled não dispara click). `Modal.test.tsx` (9 casos: renderiza/não renderiza, aria-modal, aria-labelledby, backdrop fecha, clique interno não fecha, Escape fecha, botão Fechar, sem Escape quando fechado). `Field.test.tsx` (7 casos: label, erro, hint, hint oculto com erro, textarea, digitação, integração com `register` do react-hook-form). `DogCard.test.tsx` (9 casos: nome, meta porte+idade, fallback 🐾, imagem com foto, sem role=button sem onClick, role=button com onClick, clique dispara callback, Enter, Espaço). `DoacaoSection.test.tsx` (4 casos: exibe chave PIX, clipboard.writeText com a chave certa, mostra "Copiado!", restaura após 2 s via fake timer + act). `AdminGuard.test.tsx` (4 casos: sem sessão → /admin/login; aal1 sem TOTP → /admin/enroll; aal1 com TOTP → /admin/verify; aal2 → libera filhos). `AdminGuard` testado mockando os módulos `features/auth/hooks` e `features/auth/api`, sem tocar a rede.
- **Decisões:** fake timers para DoacaoSection são aplicados apenas no teste que precisa deles (try/finally); testes de click usam `userEvent` direto (sem fake timers globais) para evitar deadlock de microtask. `vi.useFakeTimers()` global + `userEvent.setup()` causa timeout de 5 s independente de `delay: null` — isolado por test.
- **Arquivos:** `src/shared/ui/Button.test.tsx`, `src/shared/ui/Modal.test.tsx`, `src/shared/ui/Field.test.tsx`, `src/features/dogs/components/DogCard.test.tsx`, `src/pages/public/landing/sections/DoacaoSection.test.tsx`, `src/app/AdminGuard.test.tsx`.
- **Docs:** `ROADMAP.md` T-04 marcado; `TESTING.md` cobertura atualizada; `PROGRESS.md` atualizado.

### 2026-06-30 — `T-03` Testes unitários puros — Camada 1
- **Feito:** `sortDogs` extraída de `AdocaoPage.tsx` para `features/dogs/sort.ts` (+ tipo `SortKey`); `AdocaoPage.tsx` ajustado para importar de lá. Criados 5 arquivos de teste: `dogs/format.test.ts` (7 casos: dogAgeLabel null/futuro/ano-atual/1-ano/plural, dogCoverUrl null/empty/multi, dogPhotoUrl URL+bucket), `dogs/form.test.ts` (17 casos: emptyDogFormValues, dogToFormValues ano→idade incluindo null/futuro/ano-atual, dogFormValuesToPayload trim/conversão/nulls, validateAgeYears 9 branches), `dogs/sort.test.ts` (15 casos: todos os critérios name/age_desc/age_asc/size, nulls no fim via variação de posição de entrada para cobrir ambos os branches do if), `stories/format.test.ts` (6 casos), `stories/form.test.ts` (7 casos). Cobertura 100% nos 5 arquivos-alvo (text reporter oculta 100%; confirmado no HTML). 62 testes verdes, build ok.
- **Decisões:** null ao final do input array (não no início) para forçar insertion sort do V8 a chamar o comparador com o dog nulo como argumento `a` — cobrindo o branch `if (a.birth_year == null) return 1` que ficou descoberto na primeira versão. `dogPhotoUrl`/`storyPhotoUrl` testados via resultado real de `getPublicUrl` (síncrono, sem rede); sem mock do supabase.
- **Arquivos:** `src/features/dogs/sort.ts`, `src/pages/public/AdocaoPage.tsx`, `src/features/dogs/format.test.ts`, `src/features/dogs/form.test.ts`, `src/features/dogs/sort.test.ts`, `src/features/stories/format.test.ts`, `src/features/stories/form.test.ts`.
- **Docs:** `ROADMAP.md` T-03 marcado; `TESTING.md` cobertura atualizada; `PROGRESS.md` atualizado.

### 2026-06-30 — `T-02` Helpers de teste: renderWithProviders + MSW
- **Feito:** instalado `msw@2.x`; `src/test/render.tsx` com `renderWithProviders` (QueryClient novo por chamada com retry off, MemoryRouter, ThemeProvider); `src/test/msw/handlers.ts` com fixtures `dogFixture`/`storyFixture` e handlers base para `/rest/v1/dogs` e `/rest/v1/stories`; `src/test/msw/server.ts` com `setupServer`; `src/test/setup.ts` atualizado com mock de `window.matchMedia` e lifecycle do MSW server (listen/resetHandlers/close); `src/test/render.test.tsx` como teste-semente usando renderWithProviders + handler MSW; `npm test` verde (2 testes).
- **Decisões:** URL do Supabase lida de `import.meta.env.VITE_SUPABASE_URL` nos handlers (disponível via Vite em Vitest); `onUnhandledRequest: 'warn'` para não quebrar com requests extras de supabase-js; mock de `matchMedia` adicionado ao setup global (ThemeProvider exige).
- **Arquivos:** `package.json`, `src/test/render.tsx`, `src/test/msw/server.ts`, `src/test/msw/handlers.ts`, `src/test/setup.ts`, `src/test/render.test.tsx`.
- **Docs:** `ROADMAP.md` T-02 marcado; `TESTING.md` cobertura atualizada; `PROGRESS.md` atualizado.

### 2026-06-30 — `T-01` Infra de testes Vitest
- **Feito:** instalados Vitest 4.x, @vitest/coverage-v8, jsdom, @testing-library/react, user-event, jest-dom; `vitest.config.ts` reutiliza a config do Vite via `mergeConfig` (environment jsdom, globals, setupFiles); `src/test/setup.ts` importa jest-dom; `src/test/vitest.d.ts` com triple-slash reference para `vitest/globals` (não toca no tsconfig.app.json); `src/test/smoke.test.ts` como teste-semente; scripts `test`, `test:watch`, `coverage` no `package.json`; `vitest.config.ts` incluído no `tsconfig.node.json`. `npm test` e `npm run build` passam.
- **Decisões:** MSW e Playwright foram desacoplados desta tarefa — MSW vai em T-02; Playwright em T-06/T-07. Tipos globais do Vitest resolvidos com `src/test/vitest.d.ts` para não restringir os `@types/*` auto-incluídos (evita quebrar os tipos do React). `npm test` executa em modo one-shot (`vitest run`); watch é `test:watch`.
- **Arquivos:** `package.json`, `vitest.config.ts`, `tsconfig.node.json`, `src/test/setup.ts`, `src/test/smoke.test.ts`, `src/test/vitest.d.ts`, `ROADMAP.md`, `TESTING.md`, `AGENTS.md`.
- **Docs:** `ROADMAP.md` T-01 marcado; `TESTING.md` e `AGENTS.md` (Comandos) atualizados; `PROGRESS.md` atualizado.

### 2026-06-30 — Fase T (docs) Estratégia de testes
- **Feito:** criado `TESTING.md` com ferramentas, 5 camadas (unitário/componente/integração MSW/RLS pgTAP/E2E Playwright), convenções de localização, tabela de cobertura por feature e comandos de execução; `AGENTS.md` recebeu `TESTING.md` na tabela de documentos, passo 6 na DoD (testes obrigatórios a partir da Fase T) e invariante 9 (código sem teste = tarefa não concluída); `ROADMAP.md` ganhou a Fase T com tarefas T-01 a T-07.
- **Isenção DoD:** passo 6 (testes) inaplicável — infra de testes ainda não existe; será criada em T-01.
- **Decisões:** Fases 0–3 não são reabertas para backfill — esse é o escopo da Fase T; a política de testes entra em vigor após T-01.
- **Arquivos:** `TESTING.md` (novo), `AGENTS.md`, `ROADMAP.md`, `PROGRESS.md`.
- **Docs:** `AGENTS.md` com invariante 9 e DoD atualizada; `ROADMAP.md` com Fase T; `PROGRESS.md` atualizado.

### 2026-06-30 — `F4-04 a F4-06` Fase 4 — Histórias (público + admin)
- **Feito:** página pública `/historias` com grid de histórias; admin criar e editar história; Fase 4 concluída. *(entradas individuais não registradas no momento — consolidada aqui)*
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/pages/public/HistoriasPage.tsx`, `src/pages/admin/stories/` e relacionados, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-30 — `F4-03` `features/stories/{api,hooks,types}`
- **Feito:** criado domínio `features/stories` com tipos derivados de `shared/types/db.ts`, API `listStories` e hook `useStories` via TanStack Query.
- **Decisões:** listagem ordena por `published_at` desc e, em empate, `created_at` desc; `shared/types/db.ts` foi atualizado para refletir a tabela `stories` das migrations.
- **Arquivos:** `src/shared/types/db.ts`, `src/features/stories/types.ts`, `src/features/stories/api.ts`, `src/features/stories/hooks.ts`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-30 — `F4-02` Bucket `stories` + policy
- **Feito:** criado bucket público `stories` via migration, com upload permitido apenas para usuários autenticados.
- **Decisões:** mesmo padrão de `dogs`: download público via URL pública do bucket; sem policy pública de `SELECT` em `storage.objects` para evitar listagem.
- **Arquivos:** `supabase/migrations/20260630000002_stories_storage.sql`, `DATA_MODEL.md`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `DATA_MODEL.md` confirmou Storage de `stories`; `PROGRESS.md` atualizado.

### 2026-06-30 — `F4-01` Migration `stories` + RLS
- **Feito:** criada tabela `stories` com vínculo opcional para `dogs`, título, corpo, fotos, data de publicação, timestamps e trigger de `updated_at`; RLS permite leitura pública e escrita apenas autenticada.
- **Decisões:** `dog_id` é opcional (`on delete set null`); fotos são paths do futuro bucket `stories`; sem policy de DELETE para manter histórico.
- **Arquivos:** `supabase/migrations/20260630000001_create_stories.sql`, `DATA_MODEL.md`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `DATA_MODEL.md` confirmou o schema/RLS de `stories`; `PROGRESS.md` atualizado.

### 2026-06-30 — `F3-12` Admin: marcar adotado/falecido
- **Feito:** tabela admin ganhou controle de status por cão (`available`, `adopted`, `deceased`) com persistência via `useUpdateDog`; ao sair de `available`, o cão some da listagem pública por filtro/RLS.
- **Decisões:** status é alterado diretamente na tabela admin; sem delete físico, mantendo histórico do cão.
- **Arquivos:** `src/pages/admin/dogs/AdminDogsPage.tsx`, `ROADMAP.md`, `DESIGN_SYSTEM.md`.
- **Docs:** `ROADMAP.md` marcado; `DESIGN_SYSTEM.md` registrou badge/controle de status como 🟡; `PROGRESS.md` atualizado e Fase 3 concluída.

### 2026-06-30 — `F3-11` Admin: upload de fotos
- **Feito:** upload autenticado para o bucket `dogs`, paths salvos em `dogs.photos`, componente `DogPhotoUpload` no modal de edição com miniaturas e feedback de erro/loading; capa pública passa a usar a primeira foto enviada.
- **Decisões:** fotos são salvas em paths `dogs/<dog-id>/<timestamp>-<nome-seguro>`; remoção/reordenação não entra nesta tarefa.
- **Arquivos:** `src/features/dogs/api.ts`, `src/features/dogs/hooks.ts`, `src/features/dogs/constants.ts`, `src/features/dogs/format.ts`, `src/features/dogs/components/DogPhotoUpload.tsx`, `src/features/dogs/components/DogEditModal.tsx`, `src/pages/admin/dogs/AdminDogsPage.tsx`, `ROADMAP.md`, `DESIGN_SYSTEM.md`.
- **Docs:** `ROADMAP.md` marcado; `DESIGN_SYSTEM.md` atualizou o formulário admin de cão com upload de fotos; `PROGRESS.md` atualizado.

### 2026-06-30 — `F3-10` Admin: editar cão
- **Feito:** criado `updateDog` na API, `useUpdateDog` com invalidação das listas, campos/helpers compartilhados para formulário de cão e modal de edição aberto pela tabela admin.
- **Decisões:** edição desta tarefa cobre nome, porte, idade aproximada e descrição; status permanece para F3-12 e fotos para F3-11.
- **Arquivos:** `src/features/dogs/api.ts`, `src/features/dogs/hooks.ts`, `src/features/dogs/form.ts`, `src/features/dogs/components/DogFormFields.tsx`, `src/features/dogs/components/DogCreateForm.tsx`, `src/features/dogs/components/DogEditModal.tsx`, `src/pages/admin/dogs/AdminDogsPage.tsx`, `ROADMAP.md`, `DESIGN_SYSTEM.md`.
- **Docs:** `ROADMAP.md` marcado; `DESIGN_SYSTEM.md` registrou edição/admin de cão como 🟡; `PROGRESS.md` atualizado.

### 2026-06-30 — `F3-09` Admin: criar cão
- **Feito:** criado `createDog` na API, `useCreateDog` com invalidação das listas, formulário admin para nome, porte, idade aproximada e descrição; cadastro grava `status = available`, reseta após sucesso e o novo cão aparece na tabela.
- **Decisões:** fotos continuam fora do cadastro inicial e ficam para F3-11; idade aproximada do formulário é convertida para `birth_year`.
- **Arquivos:** `src/features/dogs/api.ts`, `src/features/dogs/hooks.ts`, `src/features/dogs/constants.ts`, `src/features/dogs/components/DogCreateForm.tsx`, `src/pages/admin/dogs/AdminDogsPage.tsx`, `src/pages/public/AdocaoPage.tsx`, `ROADMAP.md`, `DESIGN_SYSTEM.md`.
- **Docs:** `ROADMAP.md` marcado; `DESIGN_SYSTEM.md` registrou `DogCreateForm` como 🟡; `PROGRESS.md` atualizado.

### 2026-06-30 — `F3-08` Admin: listar cães
- **Feito:** `listAllDogs` na API (sem filtro de status), `useAllDogs` hook; `AdminDogsPage` com tabela responsiva (nome, porte, idade, badge de status colorido, data de cadastro), loading skeleton, empty state e erro; rota `/admin/dogs` protegida por `AdminGuard`; card "Adoção" do `AdminPage` vira link clicável para a lista.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/features/dogs/api.ts`, `src/features/dogs/hooks.ts`, `src/pages/admin/dogs/AdminDogsPage.tsx`, `src/app/router.tsx`, `src/pages/admin/AdminPage.tsx`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-07` Ordenação de cães no cliente
- **Feito:** adicionada ordenação por nome (A–Z), mais novo (birth_year desc), mais velho (birth_year asc) e porte (ordem semântica: filhote→pequeno→médio→grande→gigante); nulls vão para o final em todos os critérios de idade; contador "N cães disponíveis" exibido junto ao controle.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/pages/public/AdocaoPage.tsx`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-06` Modal de detalhes + botão → Google Forms
- **Feito:** criado `DogDetailsModal` com foto, meta, descrição e CTA para formulário; cards da página de adoção agora abrem o modal por clique/teclado.
- **Decisões:** URL do Google Forms fica em `VITE_ADOPTION_FORM_URL`; sem a variável, o CTA aparece desabilitado para evitar link inventado.
- **Arquivos:** `src/features/dogs/components/DogDetailsModal.tsx`, `src/pages/public/AdocaoPage.tsx`, `.env.example`, `ROADMAP.md`, `DESIGN_SYSTEM.md`.
- **Docs:** `ROADMAP.md` marcado; `DESIGN_SYSTEM.md` Modal / detalhe do cão → 🟡; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-05` Card do cão (público)
- **Feito:** `DogCard` (foto de capa via Storage público, nome, porte · idade, fallback 🐾 sem foto, suporte opcional a clique/teclado p/ F3-06) e helpers `dogPhotoUrl`/`dogCoverUrl`/`dogAgeLabel` em `features/dogs/format.ts`. `AdocaoPage` agora consome `useAvailableDogs` e renderiza grid responsivo (1/2/3 col) com loading (SkeletonCard), erro e empty state.
- **Decisões:** estilo/cores placeholder (🟡 rascunho) até tokens de design; idade derivada de `birth_year` (`ano atual − birth_year`).
- **Arquivos:** `src/features/dogs/format.ts`, `src/features/dogs/components/DogCard.tsx`, `src/pages/public/AdocaoPage.tsx`, `ROADMAP.md`, `DESIGN_SYSTEM.md`.
- **Docs:** `ROADMAP.md` marcado; `DESIGN_SYSTEM.md` Card (cão) → 🟡; `PROGRESS.md` atualizado.
- **Nota:** durante a tarefa, o diagnóstico do `InviteHandler` revelou a causa real da falha de convite — `VITE_SUPABASE_URL` no `.env` local estava com sufixo `/rest/v1/`, fazendo o `setSession` retornar `"Invalid path specified in request URL"`. Corrigido o `.env` para a URL base do projeto (sem sufixo, conforme decisão da F0-02); diagnóstico revertido; build limpo.

### 2026-06-29 — `CT-01` Corrigir callback de convite admin
- **Feito:** callback de convite passa a preservar o hash `type=invite`, criar sessão com `access_token`/`refresh_token` e redirecionar para `/admin/definir-senha`; fallback do GitHub Pages preserva o hash em rotas profundas.
- **Decisões:** callbacks de convite são tratados manualmente para evitar corrida com `detectSessionInUrl` do `supabase-js`.
- **Arquivos:** `src/shared/lib/supabase.ts`, `src/app/InviteHandler.tsx`, `index.html`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` registrou o débito técnico/correção; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-04` `features/dogs/{api,hooks,types}`
- **Feito:** criado domínio `features/dogs` com tipos derivados de `shared/types/db.ts`, API `listAvailableDogs` e hook `useAvailableDogs` via TanStack Query.
- **Decisões:** corrigida dívida técnica de base: `src/shared/types/db.ts` e script `npm run gen:types` adicionados; `ROADMAP.md › Dívidas` limpo para manter só a dúvida ainda aberta do sorteio da rifa.
- **Arquivos:** `src/features/dogs/api.ts`, `src/features/dogs/hooks.ts`, `src/features/dogs/types.ts`, `src/shared/types/db.ts`, `src/shared/lib/supabase.ts`, `package.json`, `ROADMAP.md`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-03` Bucket Storage `dogs` + policy
- **Feito:** criada migration para bucket público `dogs` e policy de upload autenticado em `storage.objects`.
- **Decisões:** leitura pública fica pelo bucket público/URL pública; sem policy pública de `SELECT` em `storage.objects` para não liberar listagem do bucket.
- **Arquivos:** `supabase/migrations/20260629000003_dogs_storage.sql`, `DATA_MODEL.md`.
- **Docs:** `ROADMAP.md` marcado; `DATA_MODEL.md` atualizado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-02` RLS `dogs`
- **Feito:** criada migration com policies de leitura pública só para cães `available`, leitura completa para autenticados, e INSERT/UPDATE apenas autenticados.
- **Decisões:** sem policy de DELETE para manter a convenção de não apagar fisicamente dados de domínio.
- **Arquivos:** `supabase/migrations/20260629000002_dogs_rls.sql`, `DATA_MODEL.md`.
- **Docs:** `ROADMAP.md` marcado; `DATA_MODEL.md` detalhado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F3-01` Migration `dogs` + enum `dog_status`
- **Feito:** criado `supabase/migrations/20260629000001_create_dogs.sql` com enum `dog_status`, tabela `dogs` (id, name, size, birth_year, description, photos, status, timestamps), trigger `trg_dogs_updated_at` e RLS habilitada.
- **Decisões:** `size` como `text` livre (sem enum); validação de valores na UI.
- **Arquivos:** `supabase/migrations/20260629000001_create_dogs.sql`, `DATA_MODEL.md`.
- **Docs:** `ROADMAP.md` marcado; `DATA_MODEL.md` dogs → 🟢; `PROGRESS.md` atualizado.

### 2026-06-29 — `F2-05` Seção Eventos (teaser)
- **Feito:** `EventosSection` com título "Recãopensa", texto teaser e botão `<Link to="/eventos">`. Criado `EventosPage` placeholder e rota `/eventos` no router. Fase 2 concluída.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/pages/public/landing/sections/EventosSection.tsx`, `src/pages/public/EventosPage.tsx`, `src/app/router.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F2-04` Seção Histórias (teaser)
- **Feito:** `HistoriasSection` com título, texto teaser e botão `<Link to="/historias">`. Criado `HistoriasPage` placeholder e rota `/historias` no router.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/pages/public/landing/sections/HistoriasSection.tsx`, `src/pages/public/HistoriasPage.tsx`, `src/app/router.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F2-03` Seção Adoção (teaser)
- **Feito:** `AdocaoSection` com título, texto teaser e botão `<Link to="/adocao">` usando o `Button` existente. Criado `AdocaoPage` placeholder e rota `/adocao` no router para o link funcionar.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/pages/public/landing/sections/AdocaoSection.tsx`, `src/pages/public/AdocaoPage.tsx`, `src/app/router.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F2-02` Seção Doação
- **Feito:** `DoacaoSection` com título, texto explicativo, chave PIX `abrigodamarcia@gmail.com` exibida em fonte mono com `select-all`, e botão "Copiar chave" com feedback "Copiado!" por 2 s via `navigator.clipboard`.
- **Decisões:** seção informativa (sem QR Code / geração dinâmica); chave PIX = `abrigodamarcia@gmail.com` (e-mail).
- **Arquivos:** `src/pages/public/landing/sections/DoacaoSection.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado; decisões de PIX/Doação fechadas.

### 2026-06-29 — `F2-01` Layout da landing
- **Feito:** Criado `src/pages/public/landing/sections/` com quatro stubs visíveis (`DoacaoSection`, `AdocaoSection`, `HistoriasSection`, `EventosSection`). `LandingPage.tsx` compõe as quatro seções em `<main>`; cada stub tem o `id` de âncora correto (doacao, historias, eventos) e fundo alternado para tornar as seções visíveis no scroll.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/pages/public/LandingPage.tsx`, `src/pages/public/landing/sections/DoacaoSection.tsx`, `AdocaoSection.tsx`, `HistoriasSection.tsx`, `EventosSection.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F1-11 a F1-14` Componentes compartilhados + Header
- **Feito:** `Modal` (portal, Esc/backdrop, aria-dialog, title+footer opcionais); `Field` (forwardRef, input+textarea, hint, error, dark mode; compatível com react-hook-form `register`); `Skeleton` / `SkeletonText` / `SkeletonCard` (animate-pulse); `Header` (sticky, blur, toggle de tema, menu mobile hamburger, âncoras da landing com scroll suave). `react-hook-form` instalado. `LandingPage` atualizada com o Header.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/shared/ui/Modal.tsx`, `src/shared/ui/Field.tsx`, `src/shared/ui/Skeleton.tsx`, `src/shared/ui/Header.tsx`, `src/pages/public/LandingPage.tsx`, `package.json`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F1-10` shared/ui/Card
- **Feito:** `Card` com prop `padding` (none/sm/md/lg), mais `CardHeader` e `CardFooter`; dark mode em todas as partes; usado no `AdminPage`.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/shared/ui/Card.tsx`, `src/pages/admin/AdminPage.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-28 — `F1-09` shared/ui/Button
- **Feito:** `Button` com variantes `primary/secondary/ghost/danger`, tamanhos `sm/md/lg`, estado `isLoading` (spinner animado), `disabled`, dark mode em todas as variantes. Cores em rascunho — substituir quando tokens chegarem.
- **Decisões:** marcar como 🟡 rascunho no DESIGN_SYSTEM até tokens de design serem definidos.
- **Arquivos:** `src/shared/ui/Button.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado; `DESIGN_SYSTEM.md` com bloco Button.

### 2026-06-28 — `F1-08` Theme provider (light/dark)
- **Feito:** `darkMode: 'class'` no Tailwind config; `ThemeProvider` em `src/app/theme.tsx` — lê preferência do sistema como default, persiste em `localStorage`, aplica/remove classe `.dark` no `<html>`; `useTheme()` exportado; `Providers` envolve com `ThemeProvider`.
- **Decisões:** nenhuma nova.
- **Arquivos:** `tailwind.config.ts`, `src/app/theme.tsx`, `src/app/providers.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F1-01 a F1-07` Esqueleto de rotas e auth
- **Feito:** router com `/` e `/admin` (lazy); QueryClient provider; fluxo completo de auth — login, enroll TOTP, verify TOTP; AdminGuard checando assuranceLevel (aal1→enroll/verify, aal2→acesso); signup público bloqueado por convite no painel Supabase.
- **Decisões:** F1-06 viável no free tier — sessão persiste via refresh token (padrão Supabase); re-auth TOTP após inatividade configurável no painel (Authentication → MFA).
- **Arquivos:** `src/app/router.tsx`, `src/app/providers.tsx`, `src/app/AdminGuard.tsx`, `src/features/auth/api.ts`, `src/features/auth/hooks.ts`, `src/pages/auth/LoginPage.tsx`, `src/pages/auth/EnrollTOTPPage.tsx`, `src/pages/auth/VerifyTOTPPage.tsx`, `src/pages/admin/AdminPage.tsx`, `src/pages/public/LandingPage.tsx`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F0-05/06/07` Vite base, 404.html e GitHub Action
- **Feito:** `vite.config.ts` com `base: '/site_do_abrigo/'`; `public/404.html` + script em `index.html` para fallback SPA no Pages; workflow `deploy.yml` publicando `dist/` via Actions.
- **Decisões:** GitHub Actions ao invés de branch `gh-pages` — sem build manual.
- **Arquivos:** `vite.config.ts`, `index.html`, `public/404.html`, `.github/workflows/deploy.yml`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F0-04` Client único do Supabase
- **Feito:** instalado `@supabase/supabase-js`; criado `src/shared/lib/supabase.ts` exportando client único via variáveis de ambiente; `tsc --noEmit` sem erros.
- **Decisões:** nenhuma nova.
- **Arquivos:** `src/shared/lib/supabase.ts`, `package.json`, `package-lock.json`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F0-03` .env.example + .env com credenciais Supabase
- **Feito:** criados `.env.example` (com placeholders) e `.env` (com URL base e publishable key reais); variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` carregam corretamente.
- **Decisões:** nenhuma nova.
- **Arquivos:** `.env.example`, `.env`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-29 — `F0-02` Credenciais Supabase em mãos
- **Feito:** recebidos Project URL e publishable key do Supabase; a URL base do projeto será usada sem o sufixo `/rest/v1/`.
- **Decisões:** nenhuma nova; mantida regra de nunca usar `sb_secret_...` no front.
- **Arquivos:** nenhum arquivo de código; apenas docs vivos.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado.

### 2026-06-28 — `F0-01` Criar projeto Vite + Tailwind
- **Feito:** criado app Vite com React+TS, Tailwind, configs TS/PostCSS e tela inicial em branco.
- **Decisões:** Tailwind CSS fixado como framework de estilos.
- **Arquivos:** `package.json`, `package-lock.json`, `.gitignore`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `postcss.config.js`, `tailwind.config.ts`, `src/`.
- **Docs:** `ROADMAP.md` marcado; `PROGRESS.md` atualizado; `DESIGN_SYSTEM.md` alinhado à decisão Tailwind.
