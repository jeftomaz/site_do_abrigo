-- F5-01: enums + tabelas de eventos, produtos, numeros de rifa e reservas

create type event_type as enum ('product', 'raffle');
create type reservation_status as enum ('pending', 'paid', 'cancelled');

create table events (
  id          uuid        primary key default gen_random_uuid(),
  type        event_type  not null,
  title       text        not null,
  description text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  is_active   boolean     not null default false,
  rules       jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint events_valid_dates
    check (starts_at is null or ends_at is null or ends_at >= starts_at)
);

create table products (
  id          uuid        primary key default gen_random_uuid(),
  event_id    uuid        not null references events(id),
  name        text        not null,
  description text,
  price_cents integer     not null,
  image_path  text,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint products_price_cents_non_negative
    check (price_cents >= 0),
  constraint products_event_id_id_unique
    unique (event_id, id)
);

create table raffle_numbers (
  id          uuid        primary key default gen_random_uuid(),
  event_id    uuid        not null references events(id),
  number      integer     not null,
  label       text,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint raffle_numbers_number_positive
    check (number > 0),
  constraint raffle_numbers_event_id_number_unique
    unique (event_id, number),
  constraint raffle_numbers_event_id_id_unique
    unique (event_id, id)
);

create table reservations (
  id               uuid               primary key default gen_random_uuid(),
  event_id         uuid               not null references events(id),
  product_id       uuid,
  raffle_number_id uuid,
  customer_name    text               not null,
  contact          text               not null,
  status           reservation_status not null default 'pending',
  expires_at       timestamptz        not null,
  created_at       timestamptz        not null default now(),
  updated_at       timestamptz        not null default now(),

  constraint reservations_exactly_one_item
    check ((product_id is not null) <> (raffle_number_id is not null)),
  constraint reservations_product_same_event
    foreign key (event_id, product_id) references products(event_id, id),
  constraint reservations_raffle_number_same_event
    foreign key (event_id, raffle_number_id) references raffle_numbers(event_id, id)
);

create index idx_products_event_sort
on products (event_id, sort_order, created_at);

create index idx_raffle_numbers_event_number
on raffle_numbers (event_id, number);

create index idx_reservations_event_status_expires
on reservations (event_id, status, expires_at);

create index idx_reservations_product
on reservations (product_id)
where product_id is not null;

create index idx_reservations_raffle_number
on reservations (raffle_number_id)
where raffle_number_id is not null;

create trigger trg_events_updated_at
before update on events
for each row execute procedure _set_updated_at();

create trigger trg_products_updated_at
before update on products
for each row execute procedure _set_updated_at();

create trigger trg_raffle_numbers_updated_at
before update on raffle_numbers
for each row execute procedure _set_updated_at();

create trigger trg_reservations_updated_at
before update on reservations
for each row execute procedure _set_updated_at();

-- RLS habilitada; policies explicitas entram em F5-03.
alter table events enable row level security;
alter table products enable row level security;
alter table raffle_numbers enable row level security;
alter table reservations enable row level security;
