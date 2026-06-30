-- F3-03: bucket Storage dogs + policy de upload

insert into storage.buckets (id, name, public)
values ('dogs', 'dogs', true)
on conflict (id) do update
set public = excluded.public;

create policy "dogs_storage_insert_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'dogs');

-- Bucket público serve os arquivos por URL pública.
-- Sem policy pública de SELECT para evitar liberar listagem do bucket.
