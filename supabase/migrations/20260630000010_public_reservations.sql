-- F5-08: criação pública segura de reservas

drop policy if exists "reservations_insert_public" on public.reservations;

create or replace function public.create_public_reservation(
  p_event_id uuid,
  p_product_id uuid,
  p_raffle_number_id uuid,
  p_customer_name text,
  p_contact text
)
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_event_type public.event_type;
  v_rules jsonb;
  v_hours numeric := 6;
  v_customer_name text := btrim(coalesce(p_customer_name, ''));
  v_contact text := btrim(coalesce(p_contact, ''));
  v_expires_at timestamptz;
begin
  if (p_product_id is null) = (p_raffle_number_id is null) then
    raise exception 'Informe exatamente um item para reservar';
  end if;

  if v_customer_name = '' or v_contact = '' then
    raise exception 'Nome e contato são obrigatórios';
  end if;

  select e.type, e.rules
  into v_event_type, v_rules
  from public.events as e
  where e.id = p_event_id
    and e.is_active;

  if not found then
    raise exception 'Evento indisponível';
  end if;

  if jsonb_typeof(v_rules -> 'reservation_expires_in_hours') = 'number' then
    v_hours := (v_rules ->> 'reservation_expires_in_hours')::numeric;

    if v_hours <= 0 then
      v_hours := 6;
    end if;
  end if;

  v_expires_at := now() + make_interval(secs => (v_hours * 3600)::double precision);

  if p_product_id is not null then
    if v_event_type <> 'product' then
      raise exception 'Item indisponível';
    end if;

    perform 1
    from public.products as p
    where p.id = p_product_id
      and p.event_id = p_event_id
    for update;

    if not found then
      raise exception 'Item indisponível';
    end if;

    if exists (
      select 1
      from public.reservations as r
      where r.product_id = p_product_id
        and (
          r.status = 'paid'
          or (r.status = 'pending' and r.expires_at > now())
        )
    ) then
      raise exception 'Item indisponível';
    end if;

    insert into public.reservations (
      event_id,
      product_id,
      customer_name,
      contact,
      status,
      expires_at
    )
    values (
      p_event_id,
      p_product_id,
      v_customer_name,
      v_contact,
      'pending',
      v_expires_at
    );
  else
    if v_event_type <> 'raffle' then
      raise exception 'Item indisponível';
    end if;

    perform 1
    from public.raffle_numbers as rn
    where rn.id = p_raffle_number_id
      and rn.event_id = p_event_id
    for update;

    if not found then
      raise exception 'Item indisponível';
    end if;

    if exists (
      select 1
      from public.reservations as r
      where r.raffle_number_id = p_raffle_number_id
        and (
          r.status = 'paid'
          or (r.status = 'pending' and r.expires_at > now())
        )
    ) then
      raise exception 'Item indisponível';
    end if;

    insert into public.reservations (
      event_id,
      raffle_number_id,
      customer_name,
      contact,
      status,
      expires_at
    )
    values (
      p_event_id,
      p_raffle_number_id,
      v_customer_name,
      v_contact,
      'pending',
      v_expires_at
    );
  end if;

  return v_expires_at;
end;
$$;

revoke all on function public.create_public_reservation(uuid, uuid, uuid, text, text)
from public;
grant execute on function public.create_public_reservation(uuid, uuid, uuid, text, text)
to anon, authenticated;
