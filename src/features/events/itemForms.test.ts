import { describe, expect, it } from 'vitest'
import {
  emptyProductFormValues,
  emptyRaffleNumberFormValues,
  productFormValuesToPayload,
  productToFormValues,
  raffleNumberFormValuesToPayload,
  raffleNumberToFormValues,
  validateMoneyInput,
  validateOptionalInteger,
  validatePositiveInteger,
} from './itemForms'
import type { Product, RaffleNumber } from './types'

const eventId = '00000000-0000-0000-0000-000000000901'

const product: Product = {
  id: 'product-id',
  event_id: eventId,
  name: 'Camiseta',
  description: 'Tamanho M',
  price_cents: 2550,
  image_path: null,
  sort_order: 2,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

const raffleNumber: RaffleNumber = {
  id: 'raffle-number-id',
  event_id: eventId,
  number: 21,
  label: 'Sorte',
  sort_order: 3,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

describe('product item form helpers', () => {
  it('retorna valores vazios para novo produto', () => {
    expect(emptyProductFormValues()).toEqual({
      name: '',
      description: '',
      price: '',
      sort_order: '0',
    })
  })

  it('mapeia produto para formulário', () => {
    expect(productToFormValues(product)).toEqual({
      name: 'Camiseta',
      description: 'Tamanho M',
      price: '25,50',
      sort_order: '2',
    })
  })

  it('converte formulário de produto para payload', () => {
    expect(
      productFormValuesToPayload(
        {
          name: '  Camiseta  ',
          description: '  Tamanho G  ',
          price: 'R$ 30,90',
          sort_order: '5',
        },
        eventId,
      ),
    ).toEqual({
      event_id: eventId,
      name: 'Camiseta',
      description: 'Tamanho G',
      price_cents: 3090,
      sort_order: 5,
    })
  })

  it('converte descrição vazia e ordem vazia', () => {
    const payload = productFormValuesToPayload(
      {
        name: 'Camiseta',
        description: '   ',
        price: '10',
        sort_order: '',
      },
      eventId,
    )

    expect(payload.description).toBeNull()
    expect(payload.price_cents).toBe(1000)
    expect(payload.sort_order).toBe(0)
  })
})

describe('raffle number form helpers', () => {
  it('retorna valores vazios para novo número', () => {
    expect(emptyRaffleNumberFormValues()).toEqual({
      number: '',
      label: '',
      sort_order: '0',
    })
  })

  it('mapeia número para formulário', () => {
    expect(raffleNumberToFormValues(raffleNumber)).toEqual({
      number: '21',
      label: 'Sorte',
      sort_order: '3',
    })
  })

  it('converte formulário de número para payload', () => {
    expect(
      raffleNumberFormValuesToPayload(
        {
          number: '21',
          label: '  Sorte  ',
          sort_order: '4',
        },
        eventId,
      ),
    ).toEqual({
      event_id: eventId,
      number: 21,
      label: 'Sorte',
      sort_order: 4,
    })
  })

  it('converte rótulo vazio e ordem vazia', () => {
    const payload = raffleNumberFormValuesToPayload(
      {
        number: '7',
        label: '   ',
        sort_order: '',
      },
      eventId,
    )

    expect(payload.label).toBeNull()
    expect(payload.sort_order).toBe(0)
  })
})

describe('item form validations', () => {
  it('valida preço em reais', () => {
    expect(validateMoneyInput('25')).toBe(true)
    expect(validateMoneyInput('25,5')).toBe(true)
    expect(validateMoneyInput('25.50')).toBe(true)
    expect(validateMoneyInput('')).toBe('Informe o preço.')
    expect(validateMoneyInput('abc')).toBe('Use um valor em reais, como 25,50.')
    expect(validateMoneyInput('25,555')).toBe('Use um valor em reais, como 25,50.')
  })

  it('valida inteiro positivo obrigatório', () => {
    expect(validatePositiveInteger('1')).toBe(true)
    expect(validatePositiveInteger('')).toBe('Informe um número.')
    expect(validatePositiveInteger('1.5')).toBe('Use um número inteiro.')
    expect(validatePositiveInteger('0')).toBe('Use um número maior que zero.')
  })

  it('valida inteiro opcional', () => {
    expect(validateOptionalInteger('')).toBe(true)
    expect(validateOptionalInteger('2')).toBe(true)
    expect(validateOptionalInteger('2.5')).toBe('Use um número inteiro.')
  })
})
