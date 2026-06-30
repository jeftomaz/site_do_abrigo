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
| `event_type` | product · raffle | ⬜ | tabela `events` |
| `reservation_status` | pending · paid · cancelled | ⬜ | tabela `reservations` |

## Admin & Auth · ⬜

- **Quem é admin:** todo usuário autenticado é admin. Não precisa de tabela `admins` **enquanto** o cadastro público estiver desabilitado (convite-only). Se um dia houver papéis distintos, trocar o teste de RLS de `authenticated` para uma checagem explícita.
- **2FA/MFA:** preocupação do Supabase Auth, não de tabela. Baseline: TOTP (app autenticador). Código por e-mail: confirmar suporte na F1.
- **Sessão:** persistente; re-exigir 2º fator só após X dias de inatividade (config de refresh token/JWT — confirmar no free tier).

## Padrão de RLS

Para a maioria das tabelas vale o par:

- **Leitura pública** do que é público (ex.: `dogs` com `status = 'available'`).
- **Escrita só autenticado** (admin logado via Supabase Auth).

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

### `events` · ⬜ (Fase 5)

Eventos de arrecadação. Apenas **um** ativo por vez.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| type | `event_type` | não | — | product/raffle |
| title | text | não | — | — |
| starts_at / ends_at | timestamptz | — | — | — |
| is_active | bool | não | false | só um true por vez (garantir via índice/regra) |
| rules | jsonb | sim | — | qtd/valor de números etc. |

**RLS:** SELECT público; escrita só autenticado. <!-- garantir unicidade de is_active -->

### `products` · ⬜ (Fase 5)

Itens à venda de um evento `product`.
<!-- colunas: id, event_id, name, price, image, ... -->

### `raffle_numbers` · ⬜ (Fase 5)

Números de um evento `raffle`.
<!-- colunas: id, event_id, number, ... -->

### `reservations` · ⬜ (Fase 5)

Reserva de um produto ou número, aguardando comprovante.

| Coluna | Tipo | Null | Default | Descrição |
|---|---|---|---|---|
| id | uuid | não | gen_random_uuid() | PK |
| event_id | uuid | não | — | FK → events |
| product_id | uuid | sim | — | FK → products (nulo se rifa) |
| raffle_number_id | uuid | sim | — | FK → raffle_numbers (nulo se produto) |
| contact | text | — | — | WhatsApp/Instagram do usuário |
| status | `reservation_status` | não | pending | pending/paid/cancelled |
| expires_at | timestamptz | não | — | prazo do comprovante |
| created_at | timestamptz | não | now() | — |

**Constraint:** `CHECK ((product_id IS NOT NULL) != (raffle_number_id IS NOT NULL))` — exatamente uma das duas preenchida.

**RLS:** INSERT público (usuário reserva); SELECT/UPDATE (marcar paga/cancelar) só autenticado. <!-- revisar: público pode precisar ler a própria reserva -->

---

## Disponibilidade de reserva · ⬜ (Fase 5)

**Regra:** um item está **livre** se *não* existe reserva `paid` **nem** `pending` com `expires_at > now()`.

- A query de catálogo calcula isso na hora — **não confia** no cron.
- **pg_cron** roda periodicamente só p/ marcar `pending` expiradas como `cancelled` (limpeza/consistência), nunca como fonte da verdade.

<!-- escrever a query e o job na Fase 5 -->

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

**Migration `stories`:** `supabase/migrations/20260630000002_stories_storage.sql`
**Policies `stories`:**
- SELECT/download público: via bucket público, usando URL pública; sem policy pública de `SELECT` em `storage.objects` para não liberar listagem.
- INSERT/upload: apenas autenticado, com `bucket_id = 'stories'`.
<!-- confirmar policies dos próximos buckets -->

---

## Relações (visão geral) · 🟡 rascunho

```
events 1──* products
events 1──* raffle_numbers
events 1──* reservations
dogs   1──* stories   (opcional)
```
