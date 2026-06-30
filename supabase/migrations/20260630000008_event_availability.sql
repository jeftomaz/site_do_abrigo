-- F5-04: funcoes publicas de disponibilidade de produtos e numeros de rifa

create or replace function public.list_available_products(p_event_id uuid)
returns setof public.products
language sql
stable
security definer
set search_path = public
as $$
  select p.*
  from public.products as p
  where p.event_id = p_event_id
    and exists (
      select 1
      from public.events as e
      where e.id = p.event_id
        and (e.is_active or (e.ends_at is not null and e.ends_at <= now()))
    )
    and not exists (
      select 1
      from public.reservations as r
      where r.product_id = p.id
        and (
          r.status = 'paid'
          or (r.status = 'pending' and r.expires_at > now())
        )
    )
  order by p.sort_order, p.created_at, p.name;
$$;

create or replace function public.list_available_raffle_numbers(p_event_id uuid)
returns setof public.raffle_numbers
language sql
stable
security definer
set search_path = public
as $$
  select rn.*
  from public.raffle_numbers as rn
  where rn.event_id = p_event_id
    and exists (
      select 1
      from public.events as e
      where e.id = rn.event_id
        and (e.is_active or (e.ends_at is not null and e.ends_at <= now()))
    )
    and not exists (
      select 1
      from public.reservations as r
      where r.raffle_number_id = rn.id
        and (
          r.status = 'paid'
          or (r.status = 'pending' and r.expires_at > now())
        )
    )
  order by rn.sort_order, rn.number, rn.created_at;
$$;

revoke all on function public.list_available_products(uuid) from public;
revoke all on function public.list_available_raffle_numbers(uuid) from public;

grant execute on function public.list_available_products(uuid) to anon, authenticated;
grant execute on function public.list_available_raffle_numbers(uuid) to anon, authenticated;
