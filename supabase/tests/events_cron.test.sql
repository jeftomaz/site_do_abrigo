create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(8);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

insert into public.events (id, type, title, is_active)
values ('00000000-0000-0000-0000-000000000901', 'product', 'T05 Cron Event', true);

insert into public.products (id, event_id, name, price_cents)
values
  ('00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000901', 'T05 Expired Pending Product', 2500),
  ('00000000-0000-0000-0000-000000000912', '00000000-0000-0000-0000-000000000901', 'T05 Valid Pending Product', 2500),
  ('00000000-0000-0000-0000-000000000913', '00000000-0000-0000-0000-000000000901', 'T05 Paid Product', 2500),
  ('00000000-0000-0000-0000-000000000914', '00000000-0000-0000-0000-000000000901', 'T05 Already Cancelled Product', 2500);

insert into public.reservations (id, event_id, product_id, customer_name, contact, status, expires_at)
values
  ('00000000-0000-0000-0000-000000000921', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000911', 'T05 Expired Pending Buyer', '@expired-pending', 'pending', '2000-01-01 00:00:00+00'),
  ('00000000-0000-0000-0000-000000000922', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000912', 'T05 Valid Pending Buyer', '@valid-pending', 'pending', '2099-01-01 00:00:00+00'),
  ('00000000-0000-0000-0000-000000000923', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000913', 'T05 Paid Buyer', '@paid', 'paid', '2000-01-01 00:00:00+00'),
  ('00000000-0000-0000-0000-000000000924', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000914', 'T05 Cancelled Buyer', '@cancelled', 'cancelled', '2000-01-01 00:00:00+00');

select extensions.is(
  public.cancel_expired_reservations(),
  1,
  'cancel_expired_reservations returns the number of cancelled rows'
);

select extensions.results_eq(
  $$select id, status::text from public.reservations order by id$$,
  $$values
    ('00000000-0000-0000-0000-000000000921'::uuid, 'cancelled'::text),
    ('00000000-0000-0000-0000-000000000922'::uuid, 'pending'::text),
    ('00000000-0000-0000-0000-000000000923'::uuid, 'paid'::text),
    ('00000000-0000-0000-0000-000000000924'::uuid, 'cancelled'::text)$$,
  'cleanup cancels only expired pending reservations'
);

select extensions.is(
  public.cancel_expired_reservations(),
  0,
  'cleanup is idempotent when no expired pending reservations remain'
);

select extensions.ok(
  exists (
    select 1
    from cron.job
    where jobname = 'cancel-expired-reservations'
      and schedule = '*/5 * * * *'
      and command = 'select public.cancel_expired_reservations();'
  ),
  'pg_cron job is scheduled every five minutes'
);

select extensions.has_function(
  'public',
  'cancel_expired_reservations',
  array[]::name[],
  'cleanup function exists in public schema'
);

set local role anon;

select extensions.throws_ok(
  $$select public.cancel_expired_reservations()$$,
  '42501',
  'permission denied for function cancel_expired_reservations',
  'anon cannot execute the cleanup function'
);

reset role;
set local role authenticated;

select extensions.throws_ok(
  $$select public.cancel_expired_reservations()$$,
  '42501',
  'permission denied for function cancel_expired_reservations',
  'authenticated clients cannot execute the cleanup function'
);

reset role;

select extensions.ok(
  has_function_privilege('service_role', 'public.cancel_expired_reservations()', 'execute'),
  'service_role can execute the cleanup function'
);

select * from extensions.finish();

rollback;
