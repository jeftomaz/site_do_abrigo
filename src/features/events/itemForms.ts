import type { Event, Product, RaffleNumber } from './types'

export interface ProductFormValues {
  name: string
  description: string
  price: string
  sort_order: string
}

export interface RaffleNumberFormValues {
  number: string
  label: string
  sort_order: string
}

export function emptyProductFormValues(): ProductFormValues {
  return {
    name: '',
    description: '',
    price: '',
    sort_order: '0',
  }
}

export function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description ?? '',
    price: centsToMoneyInput(product.price_cents),
    sort_order: String(product.sort_order),
  }
}

export function productFormValuesToPayload(
  values: ProductFormValues,
  eventId: Event['id'],
) {
  return {
    event_id: eventId,
    name: values.name.trim(),
    description: values.description.trim() || null,
    price_cents: moneyInputToCents(values.price),
    sort_order: integerInputToNumber(values.sort_order) ?? 0,
  }
}

export function emptyRaffleNumberFormValues(): RaffleNumberFormValues {
  return {
    number: '',
    label: '',
    sort_order: '0',
  }
}

export function raffleNumberToFormValues(
  raffleNumber: RaffleNumber,
): RaffleNumberFormValues {
  return {
    number: String(raffleNumber.number),
    label: raffleNumber.label ?? '',
    sort_order: String(raffleNumber.sort_order),
  }
}

export function raffleNumberFormValuesToPayload(
  values: RaffleNumberFormValues,
  eventId: Event['id'],
) {
  return {
    event_id: eventId,
    number: Number(values.number.trim()),
    label: values.label.trim() || null,
    sort_order: integerInputToNumber(values.sort_order) ?? 0,
  }
}

export function validateMoneyInput(value: string): true | string {
  const normalized = normalizeMoneyInput(value)
  if (!normalized) return 'Informe o preço.'
  if (!/^\d+([,.]\d{1,2})?$/.test(normalized)) {
    return 'Use um valor em reais, como 25,50.'
  }

  const cents = moneyInputToCents(value)
  if (cents < 0) return 'O preço não pode ser negativo.'
  return true
}

export function validatePositiveInteger(value: string): true | string {
  const normalized = value.trim()
  if (!normalized) return 'Informe um número.'

  const number = Number(normalized)
  if (!Number.isInteger(number)) return 'Use um número inteiro.'
  if (number <= 0) return 'Use um número maior que zero.'
  return true
}

export function validateOptionalInteger(value: string): true | string {
  const normalized = value.trim()
  if (!normalized) return true

  const number = Number(normalized)
  if (!Number.isInteger(number)) return 'Use um número inteiro.'
  return true
}

function centsToMoneyInput(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',')
}

function moneyInputToCents(value: string) {
  const number = Number(normalizeMoneyInput(value).replace(',', '.'))
  return Math.round(number * 100)
}

function normalizeMoneyInput(value: string) {
  return value.trim().replace(/^R\$\s*/, '')
}

function integerInputToNumber(value: string) {
  const normalized = value.trim()
  return normalized ? Number(normalized) : null
}
