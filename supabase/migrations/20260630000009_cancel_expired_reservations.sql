-- F5-05: job de limpeza para reservas pending expiradas

create extension if not exists pg_cron with schema extensions;

create or replace function public.cancel_expired_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cancelled_count integer;
begin
  update public.reservations
  set status = 'cancelled'
  where status = 'pending'
    and expires_at <= now();

  get diagnostics v_cancelled_count = row_count;
  return v_cancelled_count;
end;
$$;

revoke all on function public.cancel_expired_reservations() from public;
grant execute on function public.cancel_expired_reservations() to service_role;

select cron.unschedule(jobid)
from cron.job
where jobname = 'cancel-expired-reservations';

select cron.schedule(
  'cancel-expired-reservations',
  '*/5 * * * *',
  $$select public.cancel_expired_reservations();$$
);
