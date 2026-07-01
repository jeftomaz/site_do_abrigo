create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(7);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

insert into public.events (id, type, title, ends_at, is_active)
values
  ('00000000-0000-0000-0000-000000000801', 'product', 'T05 Active Product Event', null, true),
  ('00000000-0000-0000-0000-000000000802', 'raffle', 'T05 Past Raffle Event', '2000-01-01 00:00:00+00', false),
  ('00000000-0000-0000-0000-000000000803', 'product', 'T05 Draft Product Event', null, false);

insert into public.products (id, event_id, name, price_cents, sort_order)
values
  ('00000000-0000-0000-0000-000000000811', '00000000-0000-0000-0000-000000000801', 'T05 Available Product', 2500, 4),
  ('00000000-0000-0000-0000-000000000812', '00000000-0000-0000-0000-000000000801', 'T05 Paid Product', 2500, 1),
  ('00000000-0000-0000-0000-000000000813', '00000000-0000-0000-0000-000000000801', 'T05 Pending Valid Product', 2500, 2),
  ('00000000-0000-0000-0000-000000000814', '00000000-0000-0000-0000-000000000801', 'T05 Pending Expired Product', 2500, 3),
  ('00000000-0000-0000-0000-000000000815', '00000000-0000-0000-0000-000000000803', 'T05 Draft Product', 2500, 5);

insert into public.raffle_numbers (id, event_id, number, sort_order)
values
  ('00000000-0000-0000-0000-000000000821', '00000000-0000-0000-0000-000000000802', 21, 1),
  ('00000000-0000-0000-0000-000000000822', '00000000-0000-0000-0000-000000000802', 22, 2),
  ('00000000-0000-0000-0000-000000000823', '00000000-0000-0000-0000-000000000802', 23, 3);

insert into public.reservations (id, event_id, product_id, customer_name, contact, status, expires_at)
values
  ('00000000-0000-0000-0000-000000000831', '00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000812', 'T05 Paid Buyer', '@paid', 'paid', '2099-01-01 00:00:00+00'),
  ('00000000-0000-0000-0000-000000000832', '00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000813', 'T05 Pending Buyer', '@pending', 'pending', '2099-01-01 00:00:00+00'),
  ('00000000-0000-0000-0000-000000000833', '00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000814', 'T05 Expired Buyer', '@expired', 'pending', '2000-01-01 00:00:00+00');

insert into public.reservations (id, event_id, raffle_number_id, customer_name, contact, status, expires_at)
values
  ('00000000-0000-0000-0000-000000000834', '00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000822', 'T05 Raffle Paid Buyer', '@paid', 'paid', '2099-01-01 00:00:00+00'),
  ('00000000-0000-0000-0000-000000000835', '00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000823', 'T05 Raffle Expired Buyer', '@expired', 'pending', '2000-01-01 00:00:00+00');

set local role anon;

select extensions.results_eq(
  $$select name from public.list_available_products('00000000-0000-0000-0000-000000000801')$$,
  $$values ('T05 Pending Expired Product'::text), ('T05 Available Product'::text)$$,
  'available products exclude paid and non-expired pending reservations'
);

select extensions.results_eq(
  $$select number from public.list_available_raffle_numbers('00000000-0000-0000-0000-000000000802')$$,
  $$values (21::integer), (23::integer)$$,
  'available raffle numbers exclude paid reservations and keep expired pending numbers'
);

select extensions.is(
  (select count(*)::integer from public.list_available_products('00000000-0000-0000-0000-000000000803')),
  0,
  'availability functions do not expose draft events to anon'
);

select extensions.is(
  (select count(*)::integer from public.reservations),
  0,
  'anon still cannot read reservation customer data directly'
);

select extensions.lives_ok(
  $$select * from public.list_available_products('00000000-0000-0000-0000-000000000801')$$,
  'anon can execute product availability function'
);

select extensions.lives_ok(
  $$select * from public.list_available_raffle_numbers('00000000-0000-0000-0000-000000000802')$$,
  'anon can execute raffle availability function'
);

reset role;
set local role authenticated;

select extensions.results_eq(
  $$select name from public.list_available_products('00000000-0000-0000-0000-000000000801')$$,
  $$values ('T05 Pending Expired Product'::text), ('T05 Available Product'::text)$$,
  'authenticated callers get the same availability rule'
);

reset role;

select * from extensions.finish();

rollback;
