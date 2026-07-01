-- F5-02: garante no maximo um evento ativo por vez

create unique index idx_events_one_active
on events (is_active)
where is_active;
