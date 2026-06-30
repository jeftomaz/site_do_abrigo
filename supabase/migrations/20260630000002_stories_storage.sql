-- F4-02: bucket Storage stories + policy de upload

insert into storage.buckets (id, name, public)
values ('stories', 'stories', true)
on conflict (id) do update
set public = excluded.public;

create policy "stories_storage_insert_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'stories');

-- Bucket público serve os arquivos por URL pública.
-- Sem policy pública de SELECT para evitar liberar listagem do bucket.
