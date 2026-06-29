# PROGRESS.md

Registro **vivo** do desenvolvimento. Atualizado ao fim de **cada** tarefa (ver Definition of Done no `AGENTS.md`).
Quem retoma o projeto lê primeiro o bloco **Atual**, depois **Decisões fixadas**, depois o **Log** (mais recente no topo).

## Atual

- **Fase:** 3 — Adoção (cães)
- **Próxima tarefa:** F3-02
- **Fase concluída:** Fase 2 — Landing page ✓ · Fase 1 — Esqueleto compartilhado ✓
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
