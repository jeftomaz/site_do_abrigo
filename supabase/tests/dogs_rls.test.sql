create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(11);

truncate table public.stories, public.dogs restart identity cascade;

insert into public.dogs (id, name, size, birth_year, description, status)
values
  ('00000000-0000-0000-0000-000000000101', 'T05 Dog Available', 'medio', 2021, 'Visible to anon.', 'available'),
  ('00000000-0000-0000-0000-000000000102', 'T05 Dog Adopted', 'pequeno', 2020, 'Hidden from anon.', 'adopted'),
  ('00000000-0000-0000-0000-000000000103', 'T05 Dog Deceased', 'grande', 2019, 'Hidden from anon.', 'deceased');

set local role anon;

select extensions.results_eq(
  $$select name from public.dogs order by name$$,
  $$values ('T05 Dog Available'::text)$$,
  'anon SELECT sees only available dogs'
);

select extensions.is(
  (select count(*)::integer from public.dogs where status in ('adopted', 'deceased')),
  0,
  'anon SELECT does not see adopted/deceased dogs'
);

select extensions.throws_ok(
  $$insert into public.dogs (id, name, status) values ('00000000-0000-0000-0000-000000000104', 'T05 Dog Anon Insert', 'available')$$,
  '42501',
  'new row violates row-level security policy for table "dogs"',
  'anon INSERT on dogs is denied'
);

update public.dogs
set name = 'T05 Dog Anon Update'
where id = '00000000-0000-0000-0000-000000000101';

select extensions.is(
  (select name from public.dogs where id = '00000000-0000-0000-0000-000000000101'),
  'T05 Dog Available',
  'anon UPDATE on dogs does not change rows'
);

delete from public.dogs
where id = '00000000-0000-0000-0000-000000000101';

select extensions.is(
  (select count(*)::integer from public.dogs where id = '00000000-0000-0000-0000-000000000101'),
  1,
  'anon DELETE on dogs is denied'
);

reset role;
set local role authenticated;

select extensions.results_eq(
  $$select status::text from public.dogs order by status::text$$,
  $$values ('adopted'::text), ('available'::text), ('deceased'::text)$$,
  'authenticated SELECT sees all dog statuses'
);

select extensions.lives_ok(
  $$insert into public.dogs (id, name, status) values ('00000000-0000-0000-0000-000000000105', 'T05 Dog Auth Insert', 'available')$$,
  'authenticated INSERT on dogs is allowed'
);

select extensions.is(
  (select count(*)::integer from public.dogs where id = '00000000-0000-0000-0000-000000000105'),
  1,
  'authenticated INSERT creates a dog'
);

select extensions.lives_ok(
  $$update public.dogs set status = 'adopted' where id = '00000000-0000-0000-0000-000000000105'$$,
  'authenticated UPDATE on dogs is allowed'
);

select extensions.is(
  (select status::text from public.dogs where id = '00000000-0000-0000-0000-000000000105'),
  'adopted',
  'authenticated UPDATE changes a dog'
);

delete from public.dogs
where id = '00000000-0000-0000-0000-000000000105';

select extensions.is(
  (select count(*)::integer from public.dogs where id = '00000000-0000-0000-0000-000000000105'),
  1,
  'authenticated DELETE on dogs is denied'
);

reset role;

select * from extensions.finish();

rollback;
