import { describe, expect, it } from 'vitest'
import type { Event, Product, RaffleNumber } from './types'
import {
  DEFAULT_RESERVATION_EXPIRES_IN_HOURS,
  formatPriceCents,
  productLabel,
  raffleNumberLabel,
  rafflePriceCents,
  reservationExpiresAt,
  reservationExpiresInHours,
} from './format'

const event: Event = {
  id: '00000000-0000-0000-0000-000000000901',
  title: 'Recãopensa',
  description: null,
  type: 'raffle',
  is_active: true,
  starts_at: null,
  ends_at: null,
  rules: {},
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

const product: Product = {
  id: '00000000-0000-0000-0000-000000000911',
  event_id: event.id,
  name: 'Caneca solidária',
  description: null,
  price_cents: 2500,
  image_path: null,
  sort_order: 0,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

const raffleNumber: RaffleNumber = {
  id: '00000000-0000-0000-0000-000000000921',
  event_id: event.id,
  number: 21,
  label: null,
  sort_order: 0,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

describe('events format helpers', () => {
  it('usa 6 horas como prazo padrão de reserva', () => {
    expect(reservationExpiresInHours(event)).toBe(
      DEFAULT_RESERVATION_EXPIRES_IN_HOURS,
    )
  })

  it('lê prazo configurável em event.rules', () => {
    expect(
      reservationExpiresInHours({
        ...event,
        rules: { reservation_expires_in_hours: 12 },
      }),
    ).toBe(12)
  })

  it('ignora prazo inválido em event.rules', () => {
    expect(
      reservationExpiresInHours({
        ...event,
        rules: { reservation_expires_in_hours: -1 },
      }),
    ).toBe(DEFAULT_RESERVATION_EXPIRES_IN_HOURS)
  })

  it('calcula expires_at a partir do prazo', () => {
    expect(reservationExpiresAt(6, new Date('2026-06-30T12:00:00Z'))).toBe(
      '2026-06-30T18:00:00.000Z',
    )
  })

  it('lê preço da rifa quando configurado', () => {
    expect(rafflePriceCents({ ...event, rules: { raffle_price_cents: 1000 } })).toBe(
      1000,
    )
  })

  it('retorna null para preço de rifa ausente ou inválido', () => {
    expect(rafflePriceCents(event)).toBeNull()
    expect(rafflePriceCents({ ...event, rules: { raffle_price_cents: 10.5 } })).toBeNull()
  })

  it('formata preço e rótulos de itens', () => {
    expect(formatPriceCents(2500).replace(/\s/u, ' ')).toBe('R$ 25,00')
    expect(productLabel(product)).toBe('Caneca solidária')
    expect(raffleNumberLabel(raffleNumber)).toBe('Número 21')
    expect(raffleNumberLabel({ ...raffleNumber, label: 'Maria' })).toBe(
      '21 - Maria',
    )
  })
})
