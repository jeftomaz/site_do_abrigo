-- F5-03: RLS de eventos, produtos, numeros de rifa e reservas

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.events to anon, authenticated, service_role;
grant select, insert, update, delete on table public.products to anon, authenticated, service_role;
grant select, insert, update, delete on table public.raffle_numbers to anon, authenticated, service_role;
grant select, insert, update, delete on table public.reservations to anon, authenticated, service_role;

create policy "events_select_public"
on events
for select
to anon
using (is_active or (ends_at is not null and ends_at <= now()));

create policy "events_select_all_authenticated"
on events
for select
to authenticated
using (true);

create policy "events_insert_authenticated"
on events
for insert
to authenticated
with check (true);

create policy "events_update_authenticated"
on events
for update
to authenticated
using (true)
with check (true);

create policy "products_select_public"
on products
for select
to anon
using (
  exists (
    select 1
    from events
    where events.id = products.event_id
      and (events.is_active or (events.ends_at is not null and events.ends_at <= now()))
  )
);

create policy "products_select_all_authenticated"
on products
for select
to authenticated
using (true);

create policy "products_insert_authenticated"
on products
for insert
to authenticated
with check (true);

create policy "products_update_authenticated"
on products
for update
to authenticated
using (true)
with check (true);

create policy "raffle_numbers_select_public"
on raffle_numbers
for select
to anon
using (
  exists (
    select 1
    from events
    where events.id = raffle_numbers.event_id
      and (events.is_active or (events.ends_at is not null and events.ends_at <= now()))
  )
);

create policy "raffle_numbers_select_all_authenticated"
on raffle_numbers
for select
to authenticated
using (true);

create policy "raffle_numbers_insert_authenticated"
on raffle_numbers
for insert
to authenticated
with check (true);

create policy "raffle_numbers_update_authenticated"
on raffle_numbers
for update
to authenticated
using (true)
with check (true);

create policy "reservations_select_all_authenticated"
on reservations
for select
to authenticated
using (true);

create policy "reservations_insert_public"
on reservations
for insert
to anon
with check (
  status = 'pending'
  and exists (
    select 1
    from events
    where events.id = reservations.event_id
      and events.is_active
  )
);

create policy "reservations_insert_authenticated"
on reservations
for insert
to authenticated
with check (true);

create policy "reservations_update_authenticated"
on reservations
for update
to authenticated
using (true)
with check (true);

-- Sem policy de DELETE: dados de dominio nao sao apagados fisicamente.
