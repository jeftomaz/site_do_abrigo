# AGENTS.md

Guia para agentes de IA (Claude Code, Codex) e humanos. **Leia antes de escrever código.**

## O que é

Site de um abrigo de cães. Sem orçamento → hospedagem e dados gratuitos.

- **Hospedagem:** GitHub Pages (estático).
- **Backend:** Supabase (Postgres + Auth + Storage), free tier.
- **Front:** Vite + React + TypeScript.

App **único** com duas áreas por rota: público (`/`) e admin (`/admin`, lazy-loaded).

## Invariantes (não viole)

1. **App único, não dois.** Nada de duplicar config/UI. Admin é uma rota lazy; só baixa quando acessada.
2. **Segurança mora no banco, não no front.** O JS é público — qualquer um lê as rotas admin. A proteção real são as **RLS policies** do Supabase: leitura pública no que é público; escrita só autenticado. Trate o front como não-confiável. Liberar escrita pro papel `authenticated` **só é seguro porque o cadastro público é desabilitado** (admin entra por convite) — senão qualquer um viraria admin.
3. **Só a publishable key no front. Nunca a secret key.** O Supabase usa as novas chaves: `sb_publishable_…` (substitui a anon, privilégio baixo, sujeita a RLS — vai no front) e `sb_secret_…` (substitui a service_role, **bypassa RLS** — proibida no bundle). Como o site é estático (sem servidor), a secret key **não tem lugar seguro** e não entra no projeto. Escrita do admin = publishable key + sessão autenticada, liberada pelo RLS. Segredos em `.env` (gitignored); commitar só `.env.example`. Vars do front com prefixo `VITE_`.
8. **Em dúvida sobre escopo, pergunte antes de implementar.** Se uma tarefa toca o modelo de negócio do abrigo (regras de adoção, evento, reserva, copy, fluxo) e o comportamento não está claro nos docs nem na imagem, **pare e pergunte** — não invente. Melhor uma pergunta que código fora do escopo.
4. **Acesso a dados centralizado.** Todo acesso ao Supabase de um domínio vive em `features/<dominio>/api.ts`. Público e admin importam da mesma fonte — não duplique queries.
5. **Arquivos pequenos, uma responsabilidade.** Humano e IA leem qualquer arquivo com esforço (e tokens) mínimos. Arquivo grande → quebre.
6. **Não reimplemente UI.** Genéricos (Button, Card, Modal, Field, Skeleton) vivem em `shared/ui` e são reusados.
7. **Disponibilidade de reserva é calculada, não confiada a um job.** Item livre se não há reserva `paid` nem `pending com expires_at > now()`. O cron só limpa status.

## Protocolo de trabalho

Como os agentes desenvolvem. **Não é opcional.**

### Tarefas atômicas
- **Uma tarefa por vez.** Escopo de uma tarefa = uma responsabilidade. Não agrupe.
- Se uma tarefa do ROADMAP parecer ampla, **quebre em subtarefas** (mesma numeração com sufixo, ex. `F3-04a`) e registre no ROADMAP **antes** de codar.
- Não comece a próxima sem fechar a atual.
- **Dúvida de escopo ou regra de negócio → pergunte, não chute** (invariante 8). Registre a dúvida em `PROGRESS.md › Bloqueios` se ela travar a tarefa.

### Retomar ("vamos começar a próxima fase/passo")
1. Ler `PROGRESS.md` → bloco **Atual** (ponteiro) + **Decisões fixadas**.
2. Ler `ROADMAP.md` → pegar a próxima tarefa `[ ]`.
3. Executar **só** essa tarefa.

### Concluir uma tarefa — Definition of Done
Uma tarefa só está pronta quando **tudo** abaixo foi feito no mesmo passo:
1. Critério "Pronto quando" da tarefa atendido e `npm run build` passa.
2. `[x]` marcado no `ROADMAP.md`.
3. Entrada anexada no `PROGRESS.md` (data, ID, o que foi feito, decisões, arquivos tocados).
4. Ponteiro **Atual** do `PROGRESS.md` atualizado p/ a próxima tarefa.
5. Se mudou schema → `DATA_MODEL.md` atualizado. Se mudou token/componente → `DESIGN_SYSTEM.md` atualizado.

> **Documentação viva:** tarefa sem docs atualizados = tarefa **não concluída**.

## Estrutura

```
src/
  app/        App, router (público + admin lazy), providers (Query, Auth, Theme)
  shared/
    ui/       componentes genéricos reutilizáveis
    hooks/
    lib/      supabase.ts (client único), utils
    types/    db.ts (gerado pelo Supabase)
  features/   1 pasta por domínio: { api.ts, hooks.ts, types.ts, components/ }
    dogs/     adoção
    stories/  histórias
    events/   eventos, produtos, rifa, reservas
  pages/
    public/   landing (sections/), adoção, histórias, eventos
    admin/    CRUD de cada feature
supabase/
  migrations/ schema versionado
  seed.sql
public/
  404.html    fallback SPA p/ GitHub Pages
```

**Onde coloco X?**
- Lógica de dados de um domínio → `features/<x>/api.ts` + `hooks.ts`.
- Componente usado em 2+ lugares → `shared/ui`.
- Componente de um domínio só → `features/<x>/components`.
- Tela/rota → `pages/`.

## Documentos do projeto

| Arquivo | Papel | Quem mantém |
|---|---|---|
| `AGENTS.md` | regras e protocolo p/ IA | raramente muda |
| `README.md` | setup/deploy p/ humanos | raramente |
| `ROADMAP.md` | tarefas atômicas + status | a cada tarefa |
| `PROGRESS.md` | ponteiro atual + log de decisões | a cada tarefa |
| `DESIGN_SYSTEM.md` | tokens/componentes (das imagens) | ao mexer em UI |
| `DATA_MODEL.md` | schema + RLS | ao mexer no banco |

## Stack

- **TanStack Query** — estado de servidor (cache, evita refetch/boilerplate).
- **react-hook-form + zod** — formulários e validação (admin).
- **React Router** — roteamento + lazy.
- **supabase-js** — client único em `shared/lib/supabase.ts`.
- CSS: Tailwind (preferido por reduzir nº de arquivos). *(confirmar — ver PROGRESS › Decisões)*

## Convenções de código

- TS `strict`. Sem `any` (use tipos de `shared/types/db.ts`).
- Tipos vêm do banco: `npm run gen:types` → `shared/types/db.ts`. Não escreva tipos de tabela à mão.
- Componentes PascalCase; hooks `useX`; arquivos de feature camelCase.
- Sem fetch direto em componentes — sempre via hook da feature (TanStack Query).
- Comentário só quando o *porquê* não é óbvio.

## Gotchas do GitHub Pages

- `vite.config.ts`: `base: '/<repo>/'`.
- `public/404.html` redirecionando p/ `index.html` (rotas client-side).
- Deploy via GitHub Actions.

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run preview      # testar build local
npm run gen:types    # supabase gen types typescript → shared/types/db.ts
```