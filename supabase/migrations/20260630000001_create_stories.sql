-- F4-01: tabela stories + RLS

create table stories (
  id           uuid        primary key default gen_random_uuid(),
  dog_id       uuid        references dogs(id) on delete set null,
  title        text        not null,
  body         text        not null,
  photos       text[],
  published_at date        not null default current_date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger trg_stories_updated_at
before update on stories
for each row execute procedure _set_updated_at();

alter table stories enable row level security;

create policy "stories_select_public"
on stories
for select
to anon
using (true);

create policy "stories_select_all_authenticated"
on stories
for select
to authenticated
using (true);

create policy "stories_insert_authenticated"
on stories
for insert
to authenticated
with check (true);

create policy "stories_update_authenticated"
on stories
for update
to authenticated
using (true)
with check (true);

-- Sem policy de DELETE: dados de domínio não são apagados fisicamente.
