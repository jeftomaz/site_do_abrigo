import type { Json } from '../../shared/types/db'
import { DEFAULT_RESERVATION_EXPIRES_IN_HOURS, reservationExpiresInHours } from './format'
import type { Event, EventType } from './types'

export interface EventFormValues {
  title: string
  description: string
  type: EventType
  starts_at: string
  ends_at: string
  is_active: boolean
  reservation_expires_in_hours: string
}

export function emptyEventFormValues(): EventFormValues {
  return {
    title: '',
    description: '',
    type: 'raffle',
    starts_at: '',
    ends_at: '',
    is_active: false,
    reservation_expires_in_hours: String(DEFAULT_RESERVATION_EXPIRES_IN_HOURS),
  }
}

export function eventToFormValues(event: Event): EventFormValues {
  return {
    title: event.title,
    description: event.description ?? '',
    type: event.type,
    starts_at: isoToDateInput(event.starts_at),
    ends_at: isoToDateInput(event.ends_at),
    is_active: event.is_active,
    reservation_expires_in_hours: String(reservationExpiresInHours(event)),
  }
}

export function eventFormValuesToPayload(
  values: EventFormValues,
  existingRules: Json = {},
) {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    type: values.type,
    starts_at: dateInputToStartIso(values.starts_at),
    ends_at: dateInputToEndIso(values.ends_at),
    is_active: values.is_active,
    rules: rulesWithReservationDeadline(
      existingRules,
      values.reservation_expires_in_hours,
    ),
  }
}

export function validateReservationExpiresInHours(value: string): true | string {
  const normalized = value.trim()
  if (!normalized) return true

  const hours = Number(normalized)
  if (!Number.isInteger(hours)) return 'Use um número inteiro.'
  if (hours < 1) return 'Use pelo menos 1 hora.'
  if (hours > 168) return 'Use no máximo 168 horas.'
  return true
}

export function validateEventDateRange(values: EventFormValues): true | string {
  if (!values.starts_at || !values.ends_at) return true
  return (
    values.ends_at >= values.starts_at ||
    'A data de encerramento deve ser igual ou posterior ao início.'
  )
}

function isoToDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : ''
}

function dateInputToStartIso(value: string): string | null {
  return value ? `${value}T00:00:00.000Z` : null
}

function dateInputToEndIso(value: string): string | null {
  return value ? `${value}T23:59:59.999Z` : null
}

function rulesWithReservationDeadline(
  rules: Json,
  hoursInput: string,
): { [key: string]: Json | undefined } {
  const nextRules = { ...jsonObject(rules) }
  const normalized = hoursInput.trim()

  if (!normalized) {
    delete nextRules.reservation_expires_in_hours
    return nextRules
  }

  nextRules.reservation_expires_in_hours = Number(normalized)
  return nextRules
}

function jsonObject(value: Json): { [key: string]: Json | undefined } {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {}
  }

  return value
}
