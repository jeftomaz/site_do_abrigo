# DATA_MODEL.md

Fonte da verdade do banco (Supabase/Postgres). Preenchido **progressivamente**, fase a fase do ROADMAP.
A implementação real vive em `supabase/migrations/`. Aqui descrevemos schema, enums e **RLS em linguagem clara** *antes* de escrever SQL — é onde os agentes mais erram.

## Como usar

- Status por tabela: `⬜ pendente` · `🟡 rascunho` · `🟢 confirmado`.
- **Regra de RLS:** toda tabela nova nasce com RLS **habilitada** e policies explícitas. Sem policy = sem acesso.
- Tipos do front são **gerados** (`npm run gen:types`), não escritos à mão.

## Convenções · 🟡 rascunho

- PK: `id uuid default gen_random_uuid()`.
- Timestamps: `created_at`, `updated_at` (`timestamptz default now()`).
- **Sem delete físico** em dados de domínio: usar coluna `status`. Some da visão pública via RLS/filtro, mas o histórico permanece.
- Nomes de tabela no plural, colunas em `snake_case`.

## Enums

| Enum | Valores | Status | Uso |
|---|---|---|---|
| `dog_status` | available · adopted · deceased | 🟢 | tabela `dogs` |
| `event_type` | product · raffle | 🟢 | tabela `events` |
| `reservation_status` | pending · paid · cancelled | 🟢 | tabela `reservations` |

## Admin & Auth · ⬜

- **Quem é admin:** todo usuário autenticado é admin. Não precisa de tabela `admins` **enquanto** o cadastro público estiver desabilitado (convite-only). Se um dia houver papéis distintos, trocar o teste de RLS de `authenticated` para uma checagem explícita.
- **2FA/MFA:** preocupação do Supabase Auth, não de tabela. Baseline: TOTP (app autenticador). Código por e-mail: confirmar suporte na F1.
- **Sessão:** persistente; re-exigir 2º fator só após X dias de inatividade (config de refresh token/JWT — confirmar no free tier).

## Padrão de RLS

Para a maioria das tabelas vale o par:

- **Leitura pública** do que é público (ex.: `dogs` com `status = 'available'`).
- **Escrita só autenticado** (admin logado via Supabase Auth).

As roles de API (`anon`, `authenticated`) recebem privilégios SQL nas tabelas/buckets necessários para que a decisão real aconteça nas RLS policies. Migrations: `supabase/migrations/20260630000003_api_role_grants.sql` e `supabase/migrations/20260630000007_events_rls.sql`.

Descrever sempre as 4 operações por tabela: `SELECT` · `INSERT` · `UPDATE` · `DELETE`.

---

## Tabelas

Modelo a copiar por tabela:

> ### `nome_tabela` · ⬜
> **Fase:** N · **Descrição:** …
>
> | Coluna | Tipo | Null | Default | Descrição |
> |---|---|---|---|---|
> | id | uuid | não | gen_random_uuid() | PK |
>
> **Relações:** …
> **RLS:**
> - SELECT: quem / qual condição
> - INSERT / UPDATE / DELETE: quem / qual condição

---

### `dogs` · 🟢 (Fase 3)

Cães do catálogo de adoção.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| name | text | não | — | nome |
| size | text | sim | — | porte livre (ex.: "pequeno", "médio", "grande") |
| birth_year | smallint | sim | — | ano de nascimento; UI calcula idade (ano→idade e idade→ano estimado) |
| description | text | sim | — | descrição |
| photos | text[] | sim | — | paths do Supabase Storage (bucket `dogs`) |
| status | `dog_status` | não | available | available/adopted/deceased |
| created_at | timestamptz | não | now() | — |
| updated_at | timestamptz | não | now() | atualizado via trigger `trg_dogs_updated_at` |

**Migration:** `supabase/migrations/20260629000001_create_dogs.sql`
**RLS:** policies em `supabase/migrations/20260629000002_dogs_rls.sql`.
- SELECT: público (`anon`) apenas quando `status = 'available'`; autenticado vê todos os status.
- INSERT: apenas autenticado.
- UPDATE: apenas autenticado.
- DELETE: ninguém; sem delete físico para dados de domínio.
**Testes:** `supabase/tests/dogs_rls.test.sql` cobre SELECT anon/auth, INSERT/UPDATE anon negados, INSERT/UPDATE autenticados permitidos e DELETE negado para `anon`/`authenticated`.

### `stories` · 🟢 (Fase 4)

Histórias de cães adotados. Podem estar vinculadas a um cão cadastrado, mas o vínculo é opcional para permitir histórias antigas ou sem cadastro completo.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| dog_id | uuid | sim | — | FK → `dogs(id)`, `on delete set null` |
| title | text | não | — | título da história |
| body | text | não | — | texto da história |
| photos | text[] | sim | — | paths do Supabase Storage (bucket `stories`) |
| published_at | date | não | current_date | data pública da história |
| created_at | timestamptz | não | now() | — |
| updated_at | timestamptz | não | now() | atualizado via trigger `trg_stories_updated_at` |

**Migration:** `supabase/migrations/20260630000001_create_stories.sql`
**Relações:** `stories.dog_id` → `dogs.id` opcional.
**RLS:**
- SELECT: público (`anon`) e autenticado leem todas as histórias.
- INSERT: apenas autenticado.
- UPDATE: apenas autenticado.
- DELETE: ninguém; sem delete físico para dados de domínio.
**Testes:** `supabase/tests/stories_rls.test.sql` cobre leitura pública, escrita apenas autenticada, DELETE negado e FK `dog_id on delete set null`.

### `events` · 🟢 (Fase 5)

Eventos de arrecadação. Apenas **um** ativo por vez.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| type | `event_type` | não | — | product/raffle |
| title | text | não | — | título público/admin |
| description | text | sim | — | descrição do evento |
| starts_at | timestamptz | sim | — | início planejado |
| ends_at | timestamptz | sim | — | fim planejado; se preenchido junto com `starts_at`, deve ser maior ou igual |
| is_active | bool | não | false | só um true por vez (garantir via índice/regra) |
| rules | jsonb | não | `{}` | regras configuráveis (ex.: valor/prazo de reservas) |
| created_at | timestamptz | não | now() | — |
| updated_at | timestamptz | não | now() | atualizado via trigger `trg_events_updated_at` |

**Migration:** `supabase/migrations/20260630000005_create_events.sql`
**Constraint:** `events_valid_dates` impede `ends_at < starts_at` quando ambos existem.
**Índice:** `idx_events_one_active` (`supabase/migrations/20260630000006_one_active_event.sql`) é único parcial e permite no máximo um evento com `is_active = true`; eventos inativos continuam múltiplos.
**RLS:** policies em `supabase/migrations/20260630000007_events_rls.sql`.
- SELECT: público (`anon`) lê eventos ativos ou já encerrados (`ends_at <= now()`); autenticado lê todos.
- INSERT: apenas autenticado.
- UPDATE: apenas autenticado.
- DELETE: ninguém; sem delete físico para dados de domínio.
**Testes:** `supabase/tests/events_schema.test.sql` cobre enums, inserts base, constraints, triggers e RLS habilitada; `supabase/tests/events_active.test.sql` cobre a regra de um único ativo; `supabase/tests/events_rls.test.sql` cobre leitura pública/admin, escrita admin e bloqueios públicos.

### `products` · 🟢 (Fase 5)

Itens à venda de um evento `product`.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| event_id | uuid | não | — | FK → `events(id)` |
| name | text | não | — | nome do item |
| description | text | sim | — | descrição |
| price_cents | integer | não | — | preço em centavos; deve ser `>= 0` |
| image_path | text | sim | — | path futuro no bucket `events` |
| sort_order | integer | não | 0 | ordenação admin/pública |
| created_at | timestamptz | não | now() | — |
| updated_at | timestamptz | não | now() | atualizado via trigger `trg_products_updated_at` |

**Migration:** `supabase/migrations/20260630000005_create_events.sql`
**Relações:** `products.event_id` → `events.id`; par `(event_id, id)` é único para garantir reservas coerentes com o evento.
**RLS:** policies em `supabase/migrations/20260630000007_events_rls.sql`.
- SELECT: público (`anon`) lê produtos de eventos ativos ou já encerrados; autenticado lê todos.
- INSERT: apenas autenticado.
- UPDATE: apenas autenticado.
- DELETE: ninguém; sem delete físico para dados de domínio.
**Testes:** `supabase/tests/events_schema.test.sql` cobre preço não negativo e FK usada por reservas; `supabase/tests/events_rls.test.sql` cobre leitura pública/admin, escrita admin e bloqueios públicos.

### `raffle_numbers` · 🟢 (Fase 5)

Números de um evento `raffle`.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| event_id | uuid | não | — | FK → `events(id)` |
| number | integer | não | — | número da rifa; deve ser `> 0` |
| label | text | sim | — | rótulo opcional para exibição/admin |
| sort_order | integer | não | 0 | ordenação admin/pública |
| created_at | timestamptz | não | now() | — |
| updated_at | timestamptz | não | now() | atualizado via trigger `trg_raffle_numbers_updated_at` |

**Migration:** `supabase/migrations/20260630000005_create_events.sql`
**Relações:** `raffle_numbers.event_id` → `events.id`; `number` é único por evento; par `(event_id, id)` é único para reservas.
**RLS:** policies em `supabase/migrations/20260630000007_events_rls.sql`.
- SELECT: público (`anon`) lê números de eventos ativos ou já encerrados; autenticado lê todos.
- INSERT: apenas autenticado.
- UPDATE: apenas autenticado.
- DELETE: ninguém; sem delete físico para dados de domínio.
**Testes:** `supabase/tests/events_schema.test.sql` cobre número positivo e unicidade por evento; `supabase/tests/events_rls.test.sql` cobre leitura pública/admin, escrita admin e bloqueios públicos.

### `reservations` · 🟢 (Fase 5)

Reserva de um produto ou número, aguardando comprovante.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| event_id | uuid | não | — | FK → events |
| product_id | uuid | sim | — | FK → products (nulo se rifa) |
| raffle_number_id | uuid | sim | — | FK → raffle_numbers (nulo se produto) |
| customer_name | text | não | — | nome informado por quem reserva |
| contact | text | não | — | WhatsApp/Instagram do usuário |
| status | `reservation_status` | não | pending | pending/paid/cancelled |
| expires_at | timestamptz | não | — | prazo do comprovante |
| created_at | timestamptz | não | now() | — |
| updated_at | timestamptz | não | now() | atualizado via trigger `trg_reservations_updated_at` |

**Constraint:** `CHECK ((product_id IS NOT NULL) != (raffle_number_id IS NOT NULL))` — exatamente uma das duas preenchida.
**Relações:** `event_id` + item reservado precisam combinar: `(event_id, product_id)` referencia `products(event_id, id)` e `(event_id, raffle_number_id)` referencia `raffle_numbers(event_id, id)`.

**Migration:** `supabase/migrations/20260630000005_create_events.sql`
**RLS:** policies em `supabase/migrations/20260630000007_events_rls.sql`.
- SELECT: apenas autenticado, porque contém nome e contato.
- INSERT: público (`anon`) pode criar reserva `pending` para evento ativo; autenticado pode inserir.
- UPDATE: apenas autenticado.
- DELETE: ninguém; sem delete físico para dados de domínio.
**Testes:** `supabase/tests/events_schema.test.sql` cobre reserva de produto, reserva de número, XOR obrigatório e FK de item no mesmo evento; `supabase/tests/events_rls.test.sql` cobre reserva pública `pending`, bloqueio de reserva pública `paid`/inativa, leitura/admin e DELETE negado.

---

## Disponibilidade de reserva · 🟢 (Fase 5)

**Regra:** um item está **livre** se *não* existe reserva `paid` **nem** `pending` com `expires_at > now()`.

- A query de catálogo calcula isso na hora — **não confia** no cron.
- Como `reservations` não tem leitura pública, o cálculo público vive no banco em funções `security definer` estreitas:
  - `list_available_products(p_event_id uuid)` retorna apenas produtos livres de eventos públicos (ativos ou encerrados).
  - `list_available_raffle_numbers(p_event_id uuid)` retorna apenas números livres de eventos públicos (ativos ou encerrados).
- A API do front usa `features/events/api.ts` para chamar essas RPCs; componentes não leem `reservations` diretamente.
- **pg_cron** roda periodicamente só p/ marcar `pending` expiradas como `cancelled` (limpeza/consistência), nunca como fonte da verdade.
- Função interna `cancel_expired_reservations()` cancela apenas reservas `pending` com `expires_at <= now()` e retorna a quantidade de linhas alteradas. Execução pública foi revogada; `anon` e `authenticated` não executam essa função.
- Job `cancel-expired-reservations` roda a cada 5 minutos (`*/5 * * * *`) chamando `select public.cancel_expired_reservations();`.

**Migrations:** `supabase/migrations/20260630000008_event_availability.sql`, `supabase/migrations/20260630000009_cancel_expired_reservations.sql`
**Testes:** `supabase/tests/events_availability.test.sql` cobre produtos/números livres, bloqueio por `paid`, bloqueio por `pending` válido, liberação de `pending` expirado e ausência de leitura pública direta de reservas. `supabase/tests/events_cron.test.sql` cobre cancelamento de expiradas, idempotência, job agendado e restrição de execução para clientes.

---

## Storage (buckets) · 🟡

| Bucket | Conteúdo | Acesso | Status |
|---|---|---|---|
| `dogs` | fotos de cães | bucket público; upload autenticado via policy `storage.objects` | 🟢 |
| `stories` | fotos de histórias | bucket público; upload autenticado via policy `storage.objects` | 🟢 |
| `events` | imagens de produtos | leitura pública; upload autenticado | ⬜ |

**Migration `dogs`:** `supabase/migrations/20260629000003_dogs_storage.sql`
**Policies `dogs`:**
- SELECT/download público: via bucket público, usando URL pública; sem policy pública de `SELECT` em `storage.objects` para não liberar listagem.
- INSERT/upload: apenas autenticado, com `bucket_id = 'dogs'`.
**Testes `dogs`:** `supabase/tests/storage_rls.test.sql` cobre upload anônimo negado e upload autenticado permitido.

**Migration `stories`:** `supabase/migrations/20260630000002_stories_storage.sql`
**Policies `stories`:**
- SELECT/download público: via bucket público, usando URL pública; sem policy pública de `SELECT` em `storage.objects` para não liberar listagem.
- INSERT/upload: apenas autenticado, com `bucket_id = 'stories'`.
**Testes `stories`:** `supabase/tests/storage_rls.test.sql` cobre upload anônimo negado e upload autenticado permitido.
<!-- confirmar policies dos próximos buckets -->

---

## Relações (visão geral) · 🟡 rascunho

```
events 1──* products
events 1──* raffle_numbers
events 1──* reservations
products 1──* reservations
raffle_numbers 1──* reservations
dogs   1──* stories   (opcional)
```
