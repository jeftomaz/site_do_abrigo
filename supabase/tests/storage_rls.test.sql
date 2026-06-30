create extension if not exists pgtap with schema extensions;

begin;

grant usage on schema extensions to anon, authenticated;
grant execute on all functions in schema extensions to anon, authenticated;

select extensions.plan(4);

set local role anon;

select extensions.throws_ok(
  $$insert into storage.objects (bucket_id, name, metadata) values ('dogs', 't05/anon-dog.jpg', '{}'::jsonb)$$,
  '42501',
  'new row violates row-level security policy for table "objects"',
  'anon upload to dogs bucket is denied'
);

select extensions.throws_ok(
  $$insert into storage.objects (bucket_id, name, metadata) values ('stories', 't05/anon-story.jpg', '{}'::jsonb)$$,
  '42501',
  'new row violates row-level security policy for table "objects"',
  'anon upload to stories bucket is denied'
);

reset role;
set local role authenticated;

select extensions.lives_ok(
  $$insert into storage.objects (bucket_id, name, metadata) values ('dogs', 't05/auth-dog.jpg', '{}'::jsonb)$$,
  'authenticated upload to dogs bucket is allowed'
);

select extensions.lives_ok(
  $$insert into storage.objects (bucket_id, name, metadata) values ('stories', 't05/auth-story.jpg', '{}'::jsonb)$$,
  'authenticated upload to stories bucket is allowed'
);

reset role;

select * from extensions.finish();

rollback;
