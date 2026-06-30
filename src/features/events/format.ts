import type { Json } from '../../shared/types/db'
import type { Event, Product, RaffleNumber } from './types'

export const DEFAULT_RESERVATION_EXPIRES_IN_HOURS = 6
export const PIX_KEY = 'abrigodamarcia@gmail.com'

function isRecord(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function positiveNumber(value: Json | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null
  }

  return value
}

function nonNegativeInteger(value: Json | undefined) {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return null
  }

  return value
}

export function reservationExpiresInHours(event: Event) {
  if (!isRecord(event.rules)) return DEFAULT_RESERVATION_EXPIRES_IN_HOURS

  return (
    positiveNumber(event.rules.reservation_expires_in_hours) ??
    DEFAULT_RESERVATION_EXPIRES_IN_HOURS
  )
}

export function rafflePriceCents(event: Event) {
  if (!isRecord(event.rules)) return null
  return nonNegativeInteger(event.rules.raffle_price_cents)
}

export function reservationExpiresAt(hours: number, now = new Date()) {
  return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString()
}

export function formatPriceCents(priceCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceCents / 100)
}

export function formatReservationDeadline(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function productLabel(product: Product) {
  return product.name
}

export function raffleNumberLabel(raffleNumber: RaffleNumber) {
  return raffleNumber.label
    ? `${raffleNumber.number} - ${raffleNumber.label}`
    : `Número ${raffleNumber.number}`
}
