create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(8);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

insert into public.events (id, type, title, is_active, rules)
values
  ('00000000-0000-0000-0000-000000001001', 'product', 'T05 Active Product Event', true, '{"reservation_expires_in_hours": 12}'::jsonb),
  ('00000000-0000-0000-0000-000000001002', 'raffle', 'T05 Raffle Event', false, '{}'::jsonb);

insert into public.products (id, event_id, name, price_cents)
values ('00000000-0000-0000-0000-000000001011', '00000000-0000-0000-0000-000000001001', 'T05 Product', 2500);

insert into public.raffle_numbers (id, event_id, number)
values ('00000000-0000-0000-0000-000000001021', '00000000-0000-0000-0000-000000001002', 21);

set local role anon;

select extensions.throws_ok(
  $$insert into public.reservations (event_id, product_id, customer_name, contact, expires_at) values ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001011', 'T05 Direct', '@direct', '2099-01-01 00:00:00+00')$$,
  '42501',
  'new row violates row-level security policy for table "reservations"',
  'anon cannot insert reservations directly'
);

select extensions.lives_ok(
  $$select public.create_public_reservation('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001011', null, '  T05 Buyer  ', '  @buyer  ')$$,
  'anon can reserve an available product through the RPC'
);

reset role;

select extensions.is(
  (select customer_name from public.reservations where product_id = '00000000-0000-0000-0000-000000001011'),
  'T05 Buyer',
  'RPC trims and stores reservation customer data'
);

select extensions.ok(
  (
    select expires_at between now() + interval '11 hours 59 minutes'
      and now() + interval '12 hours 1 minute'
    from public.reservations
    where product_id = '00000000-0000-0000-0000-000000001011'
  ),
  'RPC uses configured reservation_expires_in_hours'
);

set local role anon;

select extensions.throws_ok(
  $$select public.create_public_reservation('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001011', null, 'T05 Duplicate', '@duplicate')$$,
  'P0001',
  'Item indisponível',
  'RPC rejects unavailable products'
);

reset role;

update public.events
set is_active = false
where id = '00000000-0000-0000-0000-000000001001';

update public.events
set is_active = true
where id = '00000000-0000-0000-0000-000000001002';

set local role anon;

select extensions.lives_ok(
  $$select public.create_public_reservation('00000000-0000-0000-0000-000000001002', null, '00000000-0000-0000-0000-000000001021', 'T05 Raffle Buyer', '@raffle')$$,
  'anon can reserve an available raffle number through the RPC'
);

reset role;

select extensions.ok(
  (
    select expires_at between now() + interval '5 hours 59 minutes'
      and now() + interval '6 hours 1 minute'
    from public.reservations
    where raffle_number_id = '00000000-0000-0000-0000-000000001021'
  ),
  'RPC uses 6 hours when no reservation deadline is configured'
);

set local role anon;

select extensions.throws_ok(
  $$select public.create_public_reservation('00000000-0000-0000-0000-000000001002', null, '00000000-0000-0000-0000-000000001021', '   ', '@blank')$$,
  'P0001',
  'Nome e contato são obrigatórios',
  'RPC validates public reservation identity fields'
);

reset role;

select * from extensions.finish();

rollback;
