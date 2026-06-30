# PROGRESS.md

Registro **vivo** do desenvolvimento. Atualizado ao fim de **cada** tarefa (ver Definition of Done no `AGENTS.md`).
Quem retoma o projeto lê primeiro o bloco **Atual**, depois **Decisões fixadas**, depois o **Log** (mais recente no topo).

## Atual

- **Fase:** 4 — Histórias
- **Próxima tarefa:** F4-01
- **Fase concluída:** Fase 3 — Adoção (cães) ✓ · Fase 2 — Landing page ✓ · Fase 1 — Esqueleto compartilhado ✓
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
