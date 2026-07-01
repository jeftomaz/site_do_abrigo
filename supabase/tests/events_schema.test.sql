create extension if not exists pgtap with schema extensions;

begin;

select extensions.plan(13);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

select extensions.results_eq(
  $$select unnest(enum_range(null::public.event_type))::text order by 1$$,
  $$values ('product'::text), ('raffle'::text)$$,
  'event_type has the expected values'
);

select extensions.results_eq(
  $$select unnest(enum_range(null::public.reservation_status))::text order by 1$$,
  $$values ('cancelled'::text), ('paid'::text), ('pending'::text)$$,
  'reservation_status has the expected values'
);

select extensions.lives_ok(
  $$
    insert into public.events (id, type, title, starts_at, ends_at)
    values
      ('00000000-0000-0000-0000-000000000501', 'product', 'T05 Product Event', '2026-07-01 10:00:00+00', '2026-07-02 10:00:00+00'),
      ('00000000-0000-0000-0000-000000000502', 'raffle', 'T05 Raffle Event', '2026-07-03 10:00:00+00', null),
      ('00000000-0000-0000-0000-000000000503', 'product', 'T05 Other Event', null, null);

    insert into public.products (id, event_id, name, price_cents)
    values ('00000000-0000-0000-0000-000000000511', '00000000-0000-0000-0000-000000000501', 'T05 Product', 2500);

    insert into public.raffle_numbers (id, event_id, number)
    values ('00000000-0000-0000-0000-000000000521', '00000000-0000-0000-0000-000000000502', 7);

    insert into public.reservations (id, event_id, product_id, customer_name, contact, expires_at)
    values ('00000000-0000-0000-0000-000000000531', '00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000511', 'T05 Buyer', '@buyer', '2026-07-01 12:00:00+00');

    insert into public.reservations (id, event_id, raffle_number_id, customer_name, contact, expires_at)
    values ('00000000-0000-0000-0000-000000000532', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000521', 'T05 Raffle Buyer', '@raffle', '2026-07-03 12:00:00+00');
  $$,
  'events schema accepts the base product and raffle data'
);

select extensions.is(
  (select count(*)::integer from public.reservations),
  2,
  'reservations can point to either a product or a raffle number'
);

select extensions.throws_ok(
  $$insert into public.events (type, title, starts_at, ends_at) values ('product', 'T05 Invalid Dates', '2026-07-02 10:00:00+00', '2026-07-01 10:00:00+00')$$,
  '23514',
  'new row for relation "events" violates check constraint "events_valid_dates"',
  'events rejects ends_at before starts_at'
);

select extensions.throws_ok(
  $$insert into public.products (event_id, name, price_cents) values ('00000000-0000-0000-0000-000000000501', 'T05 Negative Product', -1)$$,
  '23514',
  'new row for relation "products" violates check constraint "products_price_cents_non_negative"',
  'products rejects negative prices'
);

select extensions.throws_ok(
  $$insert into public.raffle_numbers (event_id, number) values ('00000000-0000-0000-0000-000000000502', 0)$$,
  '23514',
  'new row for relation "raffle_numbers" violates check constraint "raffle_numbers_number_positive"',
  'raffle_numbers rejects non-positive numbers'
);

select extensions.throws_ok(
  $$insert into public.raffle_numbers (event_id, number) values ('00000000-0000-0000-0000-000000000502', 7)$$,
  '23505',
  'duplicate key value violates unique constraint "raffle_numbers_event_id_number_unique"',
  'raffle_numbers enforces unique numbers per event'
);

select extensions.throws_ok(
  $$insert into public.reservations (event_id, product_id, raffle_number_id, customer_name, contact, expires_at) values ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000511', '00000000-0000-0000-0000-000000000521', 'T05 Both', '@both', '2026-07-01 12:00:00+00')$$,
  '23514',
  'new row for relation "reservations" violates check constraint "reservations_exactly_one_item"',
  'reservations rejects both product_id and raffle_number_id'
);

select extensions.throws_ok(
  $$insert into public.reservations (event_id, customer_name, contact, expires_at) values ('00000000-0000-0000-0000-000000000501', 'T05 Neither', '@neither', '2026-07-01 12:00:00+00')$$,
  '23514',
  'new row for relation "reservations" violates check constraint "reservations_exactly_one_item"',
  'reservations rejects missing item reference'
);

select extensions.throws_ok(
  $$insert into public.reservations (event_id, product_id, customer_name, contact, expires_at) values ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000511', 'T05 Wrong Event', '@wrong', '2026-07-01 12:00:00+00')$$,
  '23503',
  'insert or update on table "reservations" violates foreign key constraint "reservations_product_same_event"',
  'reservations requires product_id to belong to event_id'
);

update public.events
set title = 'T05 Product Event Updated'
where id = '00000000-0000-0000-0000-000000000501';

select extensions.ok(
  (select updated_at >= created_at from public.events where id = '00000000-0000-0000-0000-000000000501'),
  'events updated_at trigger runs on update'
);

select extensions.results_eq(
  $$select relname from pg_class where relname in ('events', 'products', 'raffle_numbers', 'reservations') and relrowsecurity order by relname$$,
  $$values ('events'::name), ('products'::name), ('raffle_numbers'::name), ('reservations'::name)$$,
  'events tables have RLS enabled'
);

select * from extensions.finish();

rollback;
