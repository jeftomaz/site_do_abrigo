create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(11);

truncate table public.stories, public.dogs restart identity cascade;

insert into public.dogs (id, name, status)
values ('00000000-0000-0000-0000-000000000201', 'T05 Story Dog', 'adopted');

insert into public.stories (id, dog_id, title, body, published_at)
values
  ('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000201', 'T05 Public Story', 'A visible story.', '2026-06-30'),
  ('00000000-0000-0000-0000-000000000212', null, 'T05 Public Story Without Dog', 'Another visible story.', '2026-06-30');

set local role anon;

select extensions.results_eq(
  $$select title from public.stories order by title$$,
  $$values ('T05 Public Story'::text), ('T05 Public Story Without Dog'::text)$$,
  'anon SELECT reads public stories'
);

select extensions.throws_ok(
  $$insert into public.stories (id, title, body) values ('00000000-0000-0000-0000-000000000213', 'T05 Anon Story', 'Denied.')$$,
  '42501',
  'new row violates row-level security policy for table "stories"',
  'anon INSERT on stories is denied'
);

update public.stories
set title = 'T05 Anon Updated Story'
where id = '00000000-0000-0000-0000-000000000211';

select extensions.is(
  (select title from public.stories where id = '00000000-0000-0000-0000-000000000211'),
  'T05 Public Story',
  'anon UPDATE on stories does not change rows'
);

delete from public.stories
where id = '00000000-0000-0000-0000-000000000211';

select extensions.is(
  (select count(*)::integer from public.stories where id = '00000000-0000-0000-0000-000000000211'),
  1,
  'anon DELETE on stories is denied'
);

reset role;
set local role authenticated;

select extensions.results_eq(
  $$select title from public.stories order by title$$,
  $$values ('T05 Public Story'::text), ('T05 Public Story Without Dog'::text)$$,
  'authenticated SELECT reads stories'
);

select extensions.lives_ok(
  $$insert into public.stories (id, title, body) values ('00000000-0000-0000-0000-000000000214', 'T05 Auth Story', 'Allowed.')$$,
  'authenticated INSERT on stories is allowed'
);

select extensions.is(
  (select count(*)::integer from public.stories where id = '00000000-0000-0000-0000-000000000214'),
  1,
  'authenticated INSERT creates a story'
);

select extensions.lives_ok(
  $$update public.stories set title = 'T05 Auth Updated Story' where id = '00000000-0000-0000-0000-000000000214'$$,
  'authenticated UPDATE on stories is allowed'
);

select extensions.is(
  (select title from public.stories where id = '00000000-0000-0000-0000-000000000214'),
  'T05 Auth Updated Story',
  'authenticated UPDATE changes a story'
);

delete from public.stories
where id = '00000000-0000-0000-0000-000000000214';

select extensions.is(
  (select count(*)::integer from public.stories where id = '00000000-0000-0000-0000-000000000214'),
  1,
  'authenticated DELETE on stories is denied'
);

reset role;

delete from public.dogs
where id = '00000000-0000-0000-0000-000000000201';

select extensions.is(
  (select dog_id from public.stories where id = '00000000-0000-0000-0000-000000000211'),
  null,
  'stories.dog_id is set null when the referenced dog is deleted'
);

select * from extensions.finish();

rollback;
