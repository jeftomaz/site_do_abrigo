create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(21);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

insert into public.events (id, type, title, ends_at, is_active)
values
  ('00000000-0000-0000-0000-000000000701', 'product', 'T05 Active Product Event', null, true),
  ('00000000-0000-0000-0000-000000000702', 'raffle', 'T05 Past Raffle Event', '2000-01-01 00:00:00+00', false),
  ('00000000-0000-0000-0000-000000000703', 'product', 'T05 Draft Product Event', null, false);

insert into public.products (id, event_id, name, price_cents)
values
  ('00000000-0000-0000-0000-000000000711', '00000000-0000-0000-0000-000000000701', 'T05 Active Product', 2500),
  ('00000000-0000-0000-0000-000000000713', '00000000-0000-0000-0000-000000000703', 'T05 Draft Product', 3000);

insert into public.raffle_numbers (id, event_id, number)
values
  ('00000000-0000-0000-0000-000000000722', '00000000-0000-0000-0000-000000000702', 22),
  ('00000000-0000-0000-0000-000000000723', '00000000-0000-0000-0000-000000000703', 23);

insert into public.reservations (id, event_id, product_id, customer_name, contact, expires_at)
values ('00000000-0000-0000-0000-000000000731', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000711', 'T05 Seed Buyer', '@seed', '2099-01-01 00:00:00+00');

insert into public.reservations (id, event_id, raffle_number_id, customer_name, contact, status, expires_at)
values ('00000000-0000-0000-0000-000000000732', '00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000722', 'T05 Past Buyer', '@past', 'paid', '2099-01-01 00:00:00+00');

set local role anon;

select extensions.results_eq(
  $$select title from public.events order by title$$,
  $$values ('T05 Active Product Event'::text), ('T05 Past Raffle Event'::text)$$,
  'anon SELECT reads active and past events, but not drafts'
);

select extensions.results_eq(
  $$select name from public.products order by name$$,
  $$values ('T05 Active Product'::text)$$,
  'anon SELECT reads products from public events only'
);

select extensions.results_eq(
  $$select number from public.raffle_numbers order by number$$,
  $$values (22::integer)$$,
  'anon SELECT reads raffle numbers from public events only'
);

select extensions.is(
  (select count(*)::integer from public.reservations),
  0,
  'anon SELECT cannot read reservations'
);

select extensions.throws_ok(
  $$insert into public.events (id, type, title) values ('00000000-0000-0000-0000-000000000704', 'product', 'T05 Anon Event')$$,
  '42501',
  'new row violates row-level security policy for table "events"',
  'anon INSERT on events is denied'
);

select extensions.throws_ok(
  $$insert into public.products (id, event_id, name, price_cents) values ('00000000-0000-0000-0000-000000000714', '00000000-0000-0000-0000-000000000701', 'T05 Anon Product', 1000)$$,
  '42501',
  'new row violates row-level security policy for table "products"',
  'anon INSERT on products is denied'
);

select extensions.throws_ok(
  $$insert into public.raffle_numbers (id, event_id, number) values ('00000000-0000-0000-0000-000000000724', '00000000-0000-0000-0000-000000000702', 24)$$,
  '42501',
  'new row violates row-level security policy for table "raffle_numbers"',
  'anon INSERT on raffle_numbers is denied'
);

select extensions.throws_ok(
  $$insert into public.reservations (id, event_id, product_id, customer_name, contact, expires_at) values ('00000000-0000-0000-0000-000000000733', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000711', 'T05 Public Buyer', '@public', '2099-01-01 00:00:00+00')$$,
  '42501',
  'new row violates row-level security policy for table "reservations"',
  'anon direct INSERT on reservations is denied'
);

reset role;

select extensions.is(
  (select count(*)::integer from public.reservations where id = '00000000-0000-0000-0000-000000000733'),
  0,
  'anon direct INSERT does not create a reservation row'
);

set local role anon;

select extensions.throws_ok(
  $$insert into public.reservations (id, event_id, product_id, customer_name, contact, status, expires_at) values ('00000000-0000-0000-0000-000000000734', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000711', 'T05 Public Paid Buyer', '@paid', 'paid', '2099-01-01 00:00:00+00')$$,
  '42501',
  'new row violates row-level security policy for table "reservations"',
  'anon INSERT cannot create a paid reservation'
);

select extensions.throws_ok(
  $$insert into public.reservations (id, event_id, product_id, customer_name, contact, expires_at) values ('00000000-0000-0000-0000-000000000735', '00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000713', 'T05 Draft Buyer', '@draft', '2099-01-01 00:00:00+00')$$,
  '42501',
  'new row violates row-level security policy for table "reservations"',
  'anon INSERT cannot reserve an inactive draft event'
);

update public.events
set title = 'T05 Anon Updated Event'
where id = '00000000-0000-0000-0000-000000000701';

select extensions.is(
  (select title from public.events where id = '00000000-0000-0000-0000-000000000701'),
  'T05 Active Product Event',
  'anon UPDATE on events does not change rows'
);

update public.reservations
set customer_name = 'T05 Anon Updated Buyer'
where id = '00000000-0000-0000-0000-000000000731';

reset role;

select extensions.is(
  (select customer_name from public.reservations where id = '00000000-0000-0000-0000-000000000731'),
  'T05 Seed Buyer',
  'anon UPDATE on reservations does not change rows'
);

set local role authenticated;

select extensions.results_eq(
  $$select title from public.events order by title$$,
  $$values ('T05 Active Product Event'::text), ('T05 Draft Product Event'::text), ('T05 Past Raffle Event'::text)$$,
  'authenticated SELECT reads all events'
);

select extensions.is(
  (select count(*)::integer from public.reservations),
  2,
  'authenticated SELECT reads reservations'
);

select extensions.lives_ok(
  $$insert into public.events (id, type, title, is_active) values ('00000000-0000-0000-0000-000000000705', 'raffle', 'T05 Auth Event', false)$$,
  'authenticated INSERT on events is allowed'
);

select extensions.lives_ok(
  $$update public.events set title = 'T05 Auth Updated Event' where id = '00000000-0000-0000-0000-000000000705'$$,
  'authenticated UPDATE on events is allowed'
);

select extensions.lives_ok(
  $$insert into public.products (id, event_id, name, price_cents) values ('00000000-0000-0000-0000-000000000715', '00000000-0000-0000-0000-000000000705', 'T05 Auth Product', 1200)$$,
  'authenticated INSERT on products is allowed'
);

select extensions.lives_ok(
  $$update public.reservations set status = 'paid' where id = '00000000-0000-0000-0000-000000000731'$$,
  'authenticated UPDATE on reservations is allowed'
);

delete from public.products
where id = '00000000-0000-0000-0000-000000000715';

select extensions.is(
  (select count(*)::integer from public.products where id = '00000000-0000-0000-0000-000000000715'),
  1,
  'authenticated DELETE on products is denied'
);

delete from public.reservations
where id = '00000000-0000-0000-0000-000000000731';

select extensions.is(
  (select count(*)::integer from public.reservations where id = '00000000-0000-0000-0000-000000000731'),
  1,
  'authenticated DELETE on reservations is denied'
);

reset role;

select * from extensions.finish();

rollback;
