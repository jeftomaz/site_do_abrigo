import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../../test/msw/server'
import {
  createEvent,
  createProduct,
  createRaffleNumber,
  createReservation,
  getActiveEvent,
  listAllEvents,
  listAvailableProducts,
  listAvailableRaffleNumbers,
  listPastEvents,
  listProducts,
  listRaffleNumbers,
  updateEvent,
  updateProduct,
  updateRaffleNumber,
} from './api'
import type { Event, Product, RaffleNumber } from './types'

const REST = `${import.meta.env.VITE_SUPABASE_URL as string}/rest/v1`
const eventId = '00000000-0000-0000-0000-000000000901'

const activeEventFixture: Event = {
  id: eventId,
  title: 'Recãopensa Junho 2026',
  description: null,
  type: 'raffle',
  is_active: true,
  starts_at: '2026-06-01T00:00:00Z',
  ends_at: null,
  rules: {},
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

const pastEventFixture: Event = {
  id: '00000000-0000-0000-0000-000000000902',
  title: 'Recãopensa Maio 2026',
  description: null,
  type: 'raffle',
  is_active: false,
  starts_at: '2026-05-01T00:00:00Z',
  ends_at: '2026-05-31T23:59:59Z',
  rules: {},
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-31T00:00:00Z',
}

const productFixture: Product = {
  id: '00000000-0000-0000-0000-000000000911',
  event_id: eventId,
  name: 'Produto livre',
  description: null,
  price_cents: 2500,
  image_path: null,
  sort_order: 1,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

const raffleNumberFixture: RaffleNumber = {
  id: '00000000-0000-0000-0000-000000000921',
  event_id: eventId,
  number: 21,
  label: null,
  sort_order: 1,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

describe('events api — getActiveEvent', () => {
  it('retorna evento ativo quando existe', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json(activeEventFixture)
      }),
    )

    await expect(getActiveEvent()).resolves.toEqual(activeEventFixture)
  })

  it('retorna null quando não há evento ativo (array vazio)', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json([])
      }),
    )

    await expect(getActiveEvent()).resolves.toBeNull()
  })

  it('propaga erro da query de evento ativo', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json(
          { code: 'PGRST000', message: 'Erro ao buscar evento' },
          { status: 500 },
        )
      }),
    )

    await expect(getActiveEvent()).rejects.toThrow('Erro ao buscar evento')
  })
})

describe('events api — listPastEvents', () => {
  it('retorna lista de eventos passados', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json([pastEventFixture])
      }),
    )

    await expect(listPastEvents()).resolves.toEqual([pastEventFixture])
  })

  it('retorna lista vazia quando não há eventos passados', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json([])
      }),
    )

    await expect(listPastEvents()).resolves.toEqual([])
  })

  it('propaga erro da query de eventos passados', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json(
          { code: 'PGRST000', message: 'Erro ao listar passados' },
          { status: 500 },
        )
      }),
    )

    await expect(listPastEvents()).rejects.toThrow('Erro ao listar passados')
  })
})

describe('events api — admin event CRUD', () => {
  it('lista todos os eventos para o admin', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json([activeEventFixture, pastEventFixture])
      }),
    )

    await expect(listAllEvents()).resolves.toEqual([
      activeEventFixture,
      pastEventFixture,
    ])
  })

  it('cria evento autenticado', async () => {
    let receivedBody: unknown

    server.use(
      http.post(`${REST}/events`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json(activeEventFixture)
      }),
    )

    await expect(
      createEvent({
        title: 'Recãopensa Junho 2026',
        type: 'raffle',
        is_active: true,
        rules: { reservation_expires_in_hours: 6 },
      }),
    ).resolves.toEqual(activeEventFixture)

    expect(receivedBody).toEqual({
      title: 'Recãopensa Junho 2026',
      type: 'raffle',
      is_active: true,
      rules: { reservation_expires_in_hours: 6 },
    })
  })

  it('edita evento autenticado', async () => {
    let receivedBody: unknown

    server.use(
      http.patch(`${REST}/events`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ ...activeEventFixture, title: 'Novo título' })
      }),
    )

    await expect(
      updateEvent({
        id: activeEventFixture.id,
        input: { title: 'Novo título', is_active: false },
      }),
    ).resolves.toMatchObject({ title: 'Novo título' })

    expect(receivedBody).toEqual({
      title: 'Novo título',
      is_active: false,
    })
  })

  it('propaga erro ao salvar evento', async () => {
    server.use(
      http.post(`${REST}/events`, () => {
        return HttpResponse.json(
          { code: '23505', message: 'duplicate key value violates unique constraint' },
          { status: 409 },
        )
      }),
    )

    await expect(
      createEvent({
        title: 'Segundo ativo',
        type: 'raffle',
        is_active: true,
      }),
    ).rejects.toThrow('duplicate key value')
  })
})

describe('events api — admin product CRUD', () => {
  it('lista produtos de um evento', async () => {
    server.use(
      http.get(`${REST}/products`, () => {
        return HttpResponse.json([productFixture])
      }),
    )

    await expect(listProducts(eventId)).resolves.toEqual([productFixture])
  })

  it('cria produto autenticado', async () => {
    let receivedBody: unknown

    server.use(
      http.post(`${REST}/products`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json(productFixture)
      }),
    )

    await expect(
      createProduct({
        event_id: eventId,
        name: 'Produto livre',
        price_cents: 2500,
      }),
    ).resolves.toEqual(productFixture)

    expect(receivedBody).toEqual({
      event_id: eventId,
      name: 'Produto livre',
      price_cents: 2500,
    })
  })

  it('edita produto autenticado', async () => {
    let receivedBody: unknown

    server.use(
      http.patch(`${REST}/products`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ ...productFixture, name: 'Produto editado' })
      }),
    )

    await expect(
      updateProduct({
        id: productFixture.id,
        input: { name: 'Produto editado', price_cents: 3000 },
      }),
    ).resolves.toMatchObject({ name: 'Produto editado' })

    expect(receivedBody).toEqual({
      name: 'Produto editado',
      price_cents: 3000,
    })
  })
})

describe('events api — admin raffle number CRUD', () => {
  it('lista números de rifa de um evento', async () => {
    server.use(
      http.get(`${REST}/raffle_numbers`, () => {
        return HttpResponse.json([raffleNumberFixture])
      }),
    )

    await expect(listRaffleNumbers(eventId)).resolves.toEqual([
      raffleNumberFixture,
    ])
  })

  it('cria número de rifa autenticado', async () => {
    let receivedBody: unknown

    server.use(
      http.post(`${REST}/raffle_numbers`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json(raffleNumberFixture)
      }),
    )

    await expect(
      createRaffleNumber({
        event_id: eventId,
        number: 21,
      }),
    ).resolves.toEqual(raffleNumberFixture)

    expect(receivedBody).toEqual({
      event_id: eventId,
      number: 21,
    })
  })

  it('edita número de rifa autenticado', async () => {
    let receivedBody: unknown

    server.use(
      http.patch(`${REST}/raffle_numbers`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ ...raffleNumberFixture, label: 'Sorte' })
      }),
    )

    await expect(
      updateRaffleNumber({
        id: raffleNumberFixture.id,
        input: { label: 'Sorte', sort_order: 2 },
      }),
    ).resolves.toMatchObject({ label: 'Sorte' })

    expect(receivedBody).toEqual({
      label: 'Sorte',
      sort_order: 2,
    })
  })
})

describe('events api — disponibilidade', () => {
  it('lista produtos disponíveis via RPC de disponibilidade', async () => {
    let receivedBody: unknown

    server.use(
      http.post(`${REST}/rpc/list_available_products`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json([productFixture])
      }),
    )

    await expect(listAvailableProducts(eventId)).resolves.toEqual([
      productFixture,
    ])
    expect(receivedBody).toEqual({ p_event_id: eventId })
  })

  it('lista números de rifa disponíveis via RPC de disponibilidade', async () => {
    let receivedBody: unknown

    server.use(
      http.post(
        `${REST}/rpc/list_available_raffle_numbers`,
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json([raffleNumberFixture])
        },
      ),
    )

    await expect(listAvailableRaffleNumbers(eventId)).resolves.toEqual([
      raffleNumberFixture,
    ])
    expect(receivedBody).toEqual({ p_event_id: eventId })
  })

  it('propaga erro da RPC de disponibilidade', async () => {
    server.use(
      http.post(`${REST}/rpc/list_available_products`, () => {
        return HttpResponse.json(
          { code: 'PGRST000', message: 'Erro de disponibilidade' },
          { status: 500 },
        )
      }),
    )

    await expect(listAvailableProducts(eventId)).rejects.toThrow(
      'Erro de disponibilidade',
    )
  })
})

describe('events api — createReservation', () => {
  it('cria reserva pública via RPC segura', async () => {
    let receivedBody: unknown

    server.use(
      http.post(`${REST}/rpc/create_public_reservation`, async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json('2026-06-30T18:00:00.000Z')
      }),
    )

    await expect(
      createReservation({
        eventId,
        productId: productFixture.id,
        customerName: '  Cliente Teste  ',
        contact: '  @cliente  ',
      }),
    ).resolves.toBe('2026-06-30T18:00:00.000Z')

    expect(receivedBody).toEqual({
      p_event_id: eventId,
      p_product_id: productFixture.id,
      p_raffle_number_id: null,
      p_customer_name: '  Cliente Teste  ',
      p_contact: '  @cliente  ',
    })
  })

  it('propaga erro ao criar reserva', async () => {
    server.use(
      http.post(`${REST}/rpc/create_public_reservation`, () => {
        return HttpResponse.json(
          { code: 'PGRST000', message: 'Item indisponível' },
          { status: 409 },
        )
      }),
    )

    await expect(
      createReservation({
        eventId,
        raffleNumberId: raffleNumberFixture.id,
        customerName: 'Cliente',
        contact: '@cliente',
      }),
    ).rejects.toThrow('Item indisponível')
  })
})
