-- F6-06: auditoria final de RLS — escritas anônimas negadas em tudo
-- Cobre os gaps do T-05: UPDATE/DELETE anônimos em products, raffle_numbers, events e reservations.

create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(6);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

insert into public.events (id, type, title, is_active)
values ('00000000-0000-0000-0000-000000002001', 'product', 'F6 Audit Event', true);

insert into public.products (id, event_id, name, price_cents)
values ('00000000-0000-0000-0000-000000002011', '00000000-0000-0000-0000-000000002001', 'F6 Audit Product', 1000);

insert into public.raffle_numbers (id, event_id, number)
values ('00000000-0000-0000-0000-000000002021', '00000000-0000-0000-0000-000000002001', 1);

insert into public.reservations (id, event_id, product_id, customer_name, contact, expires_at)
values ('00000000-0000-0000-0000-000000002031', '00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000002011', 'F6 Buyer', '@f6', '2099-01-01 00:00:00+00');

set local role anon;

-- products

update public.products
set name = 'F6 Anon Updated'
where id = '00000000-0000-0000-0000-000000002011';

select extensions.is(
  (select name from public.products where id = '00000000-0000-0000-0000-000000002011'),
  'F6 Audit Product',
  'anon UPDATE on products does not change rows'
);

delete from public.products
where id = '00000000-0000-0000-0000-000000002011';

select extensions.is(
  (select count(*)::integer from public.products where id = '00000000-0000-0000-0000-000000002011'),
  1,
  'anon DELETE on products is denied'
);

-- raffle_numbers

update public.raffle_numbers
set number = 999
where id = '00000000-0000-0000-0000-000000002021';

select extensions.is(
  (select number from public.raffle_numbers where id = '00000000-0000-0000-0000-000000002021'),
  1,
  'anon UPDATE on raffle_numbers does not change rows'
);

delete from public.raffle_numbers
where id = '00000000-0000-0000-0000-000000002021';

select extensions.is(
  (select count(*)::integer from public.raffle_numbers where id = '00000000-0000-0000-0000-000000002021'),
  1,
  'anon DELETE on raffle_numbers is denied'
);

-- events

delete from public.events
where id = '00000000-0000-0000-0000-000000002001';

select extensions.is(
  (select count(*)::integer from public.events where id = '00000000-0000-0000-0000-000000002001'),
  1,
  'anon DELETE on events is denied'
);

-- reservations (check como superuser pois anon não consegue ler reservations)

delete from public.reservations
where id = '00000000-0000-0000-0000-000000002031';

reset role;

select extensions.is(
  (select count(*)::integer from public.reservations where id = '00000000-0000-0000-0000-000000002031'),
  1,
  'anon DELETE on reservations is denied'
);

select * from extensions.finish();

rollback;
