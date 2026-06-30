-- F3-02: RLS da tabela dogs

create policy "dogs_select_available_public"
on dogs
for select
to anon
using (status = 'available');

create policy "dogs_select_all_authenticated"
on dogs
for select
to authenticated
using (true);

create policy "dogs_insert_authenticated"
on dogs
for insert
to authenticated
with check (true);

create policy "dogs_update_authenticated"
on dogs
for update
to authenticated
using (true)
with check (true);

-- Sem policy de DELETE: dados de domínio não são apagados fisicamente.
