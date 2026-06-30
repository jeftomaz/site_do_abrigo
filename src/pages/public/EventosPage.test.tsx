import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import type { Event, RaffleNumber } from '../../features/events/types'
import { server } from '../../test/msw/server'
import { renderWithProviders } from '../../test/render'
import EventosPage from './EventosPage'

const REST = `${import.meta.env.VITE_SUPABASE_URL as string}/rest/v1`

const activeEvent: Event = {
  id: '00000000-0000-0000-0000-000000000a01',
  title: 'Recãopensa Junho 2026',
  description: 'Rifa solidária para ajudar nos custos do abrigo.',
  type: 'raffle',
  is_active: true,
  starts_at: '2026-06-01T00:00:00Z',
  ends_at: null,
  rules: {},
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

const pastEvent: Event = {
  id: '00000000-0000-0000-0000-000000000a02',
  title: 'Bazar de Maio 2026',
  description: null,
  type: 'product',
  is_active: false,
  starts_at: '2026-05-01T00:00:00Z',
  ends_at: '2026-05-31T23:59:59Z',
  rules: {},
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-31T00:00:00Z',
}

const raffleNumber: RaffleNumber = {
  id: '00000000-0000-0000-0000-000000000a21',
  event_id: activeEvent.id,
  number: 21,
  label: null,
  sort_order: 1,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

function mockEvents(active: Event | null, past: Event[]) {
  server.use(
    http.get(`${REST}/events`, ({ request }) => {
      const url = new URL(request.url)
      const isActive = url.searchParams.get('is_active')

      if (isActive === 'eq.true') return HttpResponse.json(active ?? [])
      if (isActive === 'eq.false') return HttpResponse.json(past)

      return HttpResponse.json([])
    }),
    http.post(`${REST}/rpc/list_available_products`, () => {
      return HttpResponse.json([])
    }),
    http.post(`${REST}/rpc/list_available_raffle_numbers`, () => {
      return HttpResponse.json(active ? [raffleNumber] : [])
    }),
  )
}

describe('EventosPage', () => {
  it('renderiza o evento ativo e eventos anteriores', async () => {
    mockEvents(activeEvent, [pastEvent])

    renderWithProviders(<EventosPage />)

    expect(
      screen.getByRole('heading', { name: 'Eventos', level: 1 }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(activeEvent.title)).toBeInTheDocument()
      expect(screen.getByText(pastEvent.title)).toBeInTheDocument()
    })

    expect(screen.getAllByText('Evento ativo')).toHaveLength(2)
    expect(screen.getByText('Encerrado')).toBeInTheDocument()
    expect(screen.getByText('Rifa')).toBeInTheDocument()
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: '21' })).toBeInTheDocument()
  })

  it('cria reserva pública e exibe instrução de PIX', async () => {
    const user = userEvent.setup()
    const reservationBodies: Array<Record<string, unknown>> = []
    mockEvents(activeEvent, [])
    server.use(
      http.post(`${REST}/rpc/create_public_reservation`, async ({ request }) => {
        reservationBodies.push((await request.json()) as Record<string, unknown>)
        return HttpResponse.json('2026-06-30T18:00:00.000Z')
      }),
    )

    renderWithProviders(<EventosPage />)

    await user.click(await screen.findByRole('button', { name: '21' }))
    await user.type(screen.getByLabelText('Nome'), 'Maria Silva')
    await user.type(screen.getByLabelText('Contato'), '@maria')
    await user.click(screen.getByRole('button', { name: 'Reservar' }))

    await waitFor(() => {
      expect(screen.getByText('Reserva criada: Número 21')).toBeInTheDocument()
    })

    expect(screen.getByText(/abrigodamarcia@gmail.com/)).toBeInTheDocument()
    expect(screen.getByText(/Envie o comprovante/)).toBeInTheDocument()
    expect(reservationBodies[0]).toMatchObject({
      p_event_id: activeEvent.id,
      p_product_id: null,
      p_raffle_number_id: raffleNumber.id,
      p_customer_name: 'Maria Silva',
      p_contact: '@maria',
    })
  })

  it('renderiza estados vazios para ativo e passados', async () => {
    mockEvents(null, [])

    renderWithProviders(<EventosPage />)

    await waitFor(() => {
      expect(screen.getByText('Nenhum evento ativo no momento.')).toBeInTheDocument()
      expect(
        screen.getByText('Nenhum evento anterior publicado ainda.'),
      ).toBeInTheDocument()
    })
  })

  it('renderiza erros de carregamento', async () => {
    server.use(
      http.get(`${REST}/events`, () => {
        return HttpResponse.json(
          { code: 'PGRST000', message: 'Erro ao buscar eventos' },
          { status: 500 },
        )
      }),
    )

    renderWithProviders(<EventosPage />)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Não foi possível carregar o evento ativo. Tente novamente mais tarde.',
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'Não foi possível carregar os eventos anteriores. Tente novamente mais tarde.',
        ),
      ).toBeInTheDocument()
    })
  })
})
