-- T-06/T-07: grants para service_role nas tabelas de domínio.
-- Em Supabase Cloud o service_role recebe esses grants automaticamente;
-- no ambiente local com migrations explícitas é necessário declarar.
-- O service_role contorna RLS por definição (BYPASSRLS), então os grants
-- aqui concedem apenas o privilégio SQL — a segurança real continua nas policies.

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.dogs to service_role;
grant select, insert, update, delete on table public.stories to service_role;
