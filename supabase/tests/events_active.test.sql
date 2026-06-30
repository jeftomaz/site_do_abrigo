create extension if not exists pgtap with schema extensions;

begin;

select extensions.plan(4);

truncate table public.reservations, public.raffle_numbers, public.products, public.events restart identity cascade;

select extensions.lives_ok(
  $$
    insert into public.events (id, type, title, is_active)
    values
      ('00000000-0000-0000-0000-000000000601', 'product', 'T05 Active Event', true),
      ('00000000-0000-0000-0000-000000000602', 'raffle', 'T05 Inactive Raffle', false),
      ('00000000-0000-0000-0000-000000000603', 'product', 'T05 Inactive Product', false);
  $$,
  'events accepts one active event and many inactive events'
);

select extensions.throws_ok(
  $$insert into public.events (id, type, title, is_active) values ('00000000-0000-0000-0000-000000000604', 'raffle', 'T05 Second Active Event', true)$$,
  '23505',
  'duplicate key value violates unique constraint "idx_events_one_active"',
  'events rejects a second active event'
);

select extensions.throws_ok(
  $$update public.events set is_active = true where id = '00000000-0000-0000-0000-000000000602'$$,
  '23505',
  'duplicate key value violates unique constraint "idx_events_one_active"',
  'events rejects updating another event to active'
);

select extensions.is(
  (select count(*)::integer from public.events where is_active),
  1,
  'only one event remains active'
);

select * from extensions.finish();

rollback;
