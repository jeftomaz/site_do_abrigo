-- T-05: grants para roles usadas pela API.
-- As permissões amplas aqui deixam a decisão de acesso nas RLS policies.

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.dogs to anon, authenticated;
grant select, insert, update, delete on table public.stories to anon, authenticated;

grant usage on schema storage to anon, authenticated;
grant insert on table storage.objects to anon, authenticated;
