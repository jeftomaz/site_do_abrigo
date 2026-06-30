import { describe, expect, it } from 'vitest'
import {
  emptyEventFormValues,
  eventFormValuesToPayload,
  eventToFormValues,
  validateEventDateRange,
  validateReservationExpiresInHours,
} from './form'
import type { Event } from './types'

const eventBase: Event = {
  id: 'event-id',
  title: 'Recãopensa Junho',
  description: 'Evento solidário',
  type: 'raffle',
  is_active: true,
  starts_at: '2026-06-01T00:00:00Z',
  ends_at: '2026-06-30T23:59:59Z',
  rules: {
    reservation_expires_in_hours: 12,
    raffle_price_cents: 1500,
  },
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

describe('emptyEventFormValues', () => {
  it('retorna valores padrão para novo evento', () => {
    expect(emptyEventFormValues()).toEqual({
      title: '',
      description: '',
      type: 'raffle',
      starts_at: '',
      ends_at: '',
      is_active: false,
      reservation_expires_in_hours: '6',
    })
  })
})

describe('eventToFormValues', () => {
  it('mapeia evento para campos editáveis', () => {
    expect(eventToFormValues(eventBase)).toEqual({
      title: 'Recãopensa Junho',
      description: 'Evento solidário',
      type: 'raffle',
      starts_at: '2026-06-01',
      ends_at: '2026-06-30',
      is_active: true,
      reservation_expires_in_hours: '12',
    })
  })

  it('usa strings vazias para campos nulos e prazo padrão quando regra ausente', () => {
    const values = eventToFormValues({
      ...eventBase,
      description: null,
      starts_at: null,
      ends_at: null,
      rules: {},
    })

    expect(values.description).toBe('')
    expect(values.starts_at).toBe('')
    expect(values.ends_at).toBe('')
    expect(values.reservation_expires_in_hours).toBe('6')
  })
})

describe('eventFormValuesToPayload', () => {
  it('faz trim, converte datas e preserva regras existentes', () => {
    const payload = eventFormValuesToPayload(
      {
        title: '  Bazar de Julho  ',
        description: '  Produtos doados  ',
        type: 'product',
        starts_at: '2026-07-01',
        ends_at: '2026-07-10',
        is_active: true,
        reservation_expires_in_hours: '8',
      },
      { raffle_price_cents: 2000 },
    )

    expect(payload).toEqual({
      title: 'Bazar de Julho',
      description: 'Produtos doados',
      type: 'product',
      starts_at: '2026-07-01T00:00:00.000Z',
      ends_at: '2026-07-10T23:59:59.999Z',
      is_active: true,
      rules: {
        raffle_price_cents: 2000,
        reservation_expires_in_hours: 8,
      },
    })
  })

  it('converte campos opcionais vazios para null e remove prazo customizado', () => {
    const payload = eventFormValuesToPayload(
      {
        title: 'Evento',
        description: '   ',
        type: 'raffle',
        starts_at: '',
        ends_at: '',
        is_active: false,
        reservation_expires_in_hours: '   ',
      },
      { reservation_expires_in_hours: 12, raffle_price_cents: 1000 },
    )

    expect(payload.description).toBeNull()
    expect(payload.starts_at).toBeNull()
    expect(payload.ends_at).toBeNull()
    expect(payload.rules).toEqual({ raffle_price_cents: 1000 })
  })
})

describe('validateReservationExpiresInHours', () => {
  it('aceita vazio e inteiros entre 1 e 168', () => {
    expect(validateReservationExpiresInHours('')).toBe(true)
    expect(validateReservationExpiresInHours('1')).toBe(true)
    expect(validateReservationExpiresInHours('168')).toBe(true)
  })

  it('rejeita decimal, zero e acima do limite', () => {
    expect(validateReservationExpiresInHours('1.5')).toBe('Use um número inteiro.')
    expect(validateReservationExpiresInHours('0')).toBe('Use pelo menos 1 hora.')
    expect(validateReservationExpiresInHours('169')).toBe('Use no máximo 168 horas.')
  })
})

describe('validateEventDateRange', () => {
  it('aceita período incompleto ou válido', () => {
    expect(validateEventDateRange({ ...emptyEventFormValues(), starts_at: '2026-07-01' })).toBe(true)
    expect(
      validateEventDateRange({
        ...emptyEventFormValues(),
        starts_at: '2026-07-01',
        ends_at: '2026-07-01',
      }),
    ).toBe(true)
  })

  it('rejeita encerramento anterior ao início', () => {
    expect(
      validateEventDateRange({
        ...emptyEventFormValues(),
        starts_at: '2026-07-10',
        ends_at: '2026-07-01',
      }),
    ).toBe('A data de encerramento deve ser igual ou posterior ao início.')
  })
})
