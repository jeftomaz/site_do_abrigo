# PROGRESS.md

Registro **vivo** do desenvolvimento. Atualizado ao fim de **cada** tarefa (ver Definition of Done no `AGENTS.md`).
Quem retoma o projeto lê primeiro o bloco **Atual**, depois **Decisões fixadas**, depois o **Log** (mais recente no topo).

## Atual

- **Fase:** 0 — Fundação
- **Próxima tarefa:** F0-04
- **Bloqueios:** nenhum.

## Decisões fixadas

Decisões já tomadas, para não reabrir. Quando uma "dívida" do ROADMAP é resolvida, ela vem para cá.

| Data | Tema | Decisão |
|---|---|---|
| 2026-06-28 | Chaves Supabase | Front usa **publishable key** (`sb_publishable_…`); **secret key nunca** entra no bundle (site é estático). Escrita admin = publishable + sessão autenticada via RLS. |
| 2026-06-28 | Docs de orientação | Versionados no repo. Só segredos ficam fora (`.env` gitignored; commitar `.env.example`). |
| 2026-06-28 | Infra existente | Repo e projeto Supabase **já criados**; banco **vazio**. F0 não recria — só configura e popula. |
| 2026-06-28 | CSS framework | Usar **Tailwind CSS** como framework de estilos do app. |
| — | Geração do PIX (sem servidor) | _pendente — chave estática? BR Code por valor?_ |
| — | Escopo da Doação | _pendente — só informativo ou fluxo próprio?_ |
| — | Sorteio da rifa | _pendente — como escolher/divulgar ganhador?_ |
| — | Representação de `age` | _pendente_ |
| — | `item_ref` da reserva | _pendente_ |
| — | Estratégia de imagens | _pendente_ |

## Log

Mais recente no topo. Uma entrada por tarefa concluída. Mantenha curto.

### Modelo (copiar)

> ### AAAA-MM-DD — `ID` título
> - **Feito:** o que foi entregue (1–3 linhas).
> - **Decisões:** o que foi resolvido no caminho (ou "nenhuma").
> - **Arquivos:** caminhos tocados.
> - **Docs:** quais docs foram atualizados (ROADMAP marcado; DATA_MODEL/DESIGN_SYSTEM se aplicável).

<!-- entradas reais abaixo -->

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
