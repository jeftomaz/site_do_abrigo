import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../../test/msw/server'
import { listAvailableProducts, listAvailableRaffleNumbers } from './api'
import type { Product, RaffleNumber } from './types'

const REST = `${import.meta.env.VITE_SUPABASE_URL as string}/rest/v1`
const eventId = '00000000-0000-0000-0000-000000000901'

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

describe('events api', () => {
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
