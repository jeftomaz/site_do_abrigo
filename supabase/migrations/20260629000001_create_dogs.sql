-- F3-01: enum dog_status + tabela dogs

create type dog_status as enum ('available', 'adopted', 'deceased');

create table dogs (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  size        text,
  birth_year  smallint,
  description text,
  photos      text[],
  status      dog_status  not null default 'available',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- mantém updated_at sincronizado em cada UPDATE
create or replace function _set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_dogs_updated_at
before update on dogs
for each row execute procedure _set_updated_at();

-- RLS habilitada; policies em F3-02
alter table dogs enable row level security;
