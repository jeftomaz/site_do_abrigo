import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import type {
  Event,
  Product,
  RaffleNumber,
  Reservation,
} from '../../../features/events/types'
import { server } from '../../../test/msw/server'
import { renderWithProviders } from '../../../test/render'
import AdminEventsPage from './AdminEventsPage'

const REST = `${import.meta.env.VITE_SUPABASE_URL as string}/rest/v1`

const activeEvent: Event = {
  id: '00000000-0000-0000-0000-000000000b01',
  title: 'Recãopensa Junho 2026',
  description: 'Rifa solidária',
  type: 'raffle',
  is_active: true,
  starts_at: '2026-06-01T00:00:00Z',
  ends_at: null,
  rules: { reservation_expires_in_hours: 6, raffle_price_cents: 1500 },
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

const productEvent: Event = {
  ...activeEvent,
  id: '00000000-0000-0000-0000-000000000b02',
  title: 'Bazar de Julho 2026',
  type: 'product',
  is_active: false,
  ends_at: '2026-07-31T23:59:59Z',
}

const product: Product = {
  id: '00000000-0000-0000-0000-000000000c01',
  event_id: productEvent.id,
  name: 'Camiseta solidária',
  description: 'Tamanho M',
  price_cents: 2500,
  image_path: null,
  sort_order: 1,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

const raffleNumber: RaffleNumber = {
  id: '00000000-0000-0000-0000-000000000d01',
  event_id: activeEvent.id,
  number: 21,
  label: null,
  sort_order: 1,
  created_at: '2026-06-30T00:00:00Z',
  updated_at: '2026-06-30T00:00:00Z',
}

const reservation: Reservation = {
  id: '00000000-0000-0000-0000-000000000e01',
  event_id: activeEvent.id,
  product_id: null,
  raffle_number_id: raffleNumber.id,
  customer_name: 'Maria Silva',
  contact: '@maria',
  status: 'pending',
  expires_at: '2026-06-30T18:00:00Z',
  created_at: '2026-06-30T12:00:00Z',
  updated_at: '2026-06-30T12:00:00Z',
}

function mockEventList(events: Event[]) {
  server.use(
    http.get(`${REST}/events`, () => {
      return HttpResponse.json(events)
    }),
  )
}

describe('AdminEventsPage', () => {
  it('lista eventos e exibe o formulário de cadastro', async () => {
    mockEventList([activeEvent])

    renderWithProviders(<AdminEventsPage />)

    expect(
      screen.getByRole('heading', { name: 'Eventos', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Cadastrar evento' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(activeEvent.title)).toBeInTheDocument()
    })

    const row = screen.getByRole('row', { name: /Recãopensa Junho 2026/ })
    expect(within(row).getByText('Ativo')).toBeInTheDocument()
    expect(within(row).getByText('Rifa')).toBeInTheDocument()
    expect(within(row).getByText('6h')).toBeInTheDocument()
  })

  it('cria evento com prazo de reserva configurado', async () => {
    const user = userEvent.setup()
    const receivedBodies: unknown[] = []
    mockEventList([])
    server.use(
      http.post(`${REST}/events`, async ({ request }) => {
        receivedBodies.push(await request.json())
        return HttpResponse.json({
          ...activeEvent,
          title: 'Bazar de Julho',
          type: 'product',
          is_active: false,
        })
      }),
    )

    renderWithProviders(<AdminEventsPage />)

    await user.type(screen.getByLabelText('Título'), 'Bazar de Julho')
    await user.selectOptions(screen.getByLabelText('Tipo'), 'product')
    await user.clear(screen.getByLabelText('Prazo da reserva'))
    await user.type(screen.getByLabelText('Prazo da reserva'), '8')
    await user.type(screen.getByLabelText('Início'), '2026-07-01')
    await user.type(screen.getByLabelText('Encerramento'), '2026-07-10')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => {
      expect(screen.getByText('"Bazar de Julho" foi cadastrado.')).toBeInTheDocument()
    })

    expect(receivedBodies[0]).toMatchObject({
      title: 'Bazar de Julho',
      type: 'product',
      starts_at: '2026-07-01T00:00:00.000Z',
      ends_at: '2026-07-10T23:59:59.999Z',
      is_active: false,
      rules: { reservation_expires_in_hours: 8 },
    })
  })

  it('edita evento preservando regras existentes', async () => {
    const user = userEvent.setup()
    const receivedBodies: unknown[] = []
    mockEventList([activeEvent])
    server.use(
      http.patch(`${REST}/events`, async ({ request }) => {
        receivedBodies.push(await request.json())
        return HttpResponse.json({ ...activeEvent, title: 'Recãopensa Julho 2026' })
      }),
    )

    renderWithProviders(<AdminEventsPage />)

    await user.click(await screen.findByRole('button', { name: 'Editar' }))

    const dialog = screen.getByRole('dialog', { name: 'Editar evento' })
    await user.clear(within(dialog).getByLabelText('Título'))
    await user.type(within(dialog).getByLabelText('Título'), 'Recãopensa Julho 2026')
    await user.clear(within(dialog).getByLabelText('Prazo da reserva'))
    await user.type(within(dialog).getByLabelText('Prazo da reserva'), '10')
    await user.click(within(dialog).getByRole('button', { name: 'Salvar alterações' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Editar evento' })).not.toBeInTheDocument()
    })

    expect(receivedBodies[0]).toMatchObject({
      title: 'Recãopensa Julho 2026',
      rules: {
        reservation_expires_in_hours: 10,
        raffle_price_cents: 1500,
      },
    })
  })

  it('gerencia produtos do evento selecionado', async () => {
    const user = userEvent.setup()
    const createdBodies: unknown[] = []
    const updatedBodies: unknown[] = []
    mockEventList([productEvent])
    server.use(
      http.get(`${REST}/products`, () => {
        return HttpResponse.json([product])
      }),
      http.post(`${REST}/products`, async ({ request }) => {
        createdBodies.push(await request.json())
        return HttpResponse.json({ ...product, name: 'Caneca solidária' })
      }),
      http.patch(`${REST}/products`, async ({ request }) => {
        updatedBodies.push(await request.json())
        return HttpResponse.json({ ...product, name: 'Camiseta editada' })
      }),
    )

    renderWithProviders(<AdminEventsPage />)

    const eventRow = await screen.findByRole('row', { name: /Bazar de Julho 2026/ })
    await user.click(within(eventRow).getByRole('button', { name: 'Itens' }))

    expect(
      await screen.findByRole('heading', { name: 'Produtos' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Camiseta solidária')).toBeInTheDocument()
    expect(screen.getByText(/25,00/)).toBeInTheDocument()

    await user.type(screen.getByLabelText('Nome'), 'Caneca solidária')
    await user.type(screen.getByLabelText('Preço (R$)'), '30,50')
    await user.click(screen.getByRole('button', { name: 'Cadastrar produto' }))

    await waitFor(() => {
      expect(screen.getByText('"Caneca solidária" foi cadastrado.')).toBeInTheDocument()
    })

    expect(createdBodies[0]).toMatchObject({
      event_id: productEvent.id,
      name: 'Caneca solidária',
      price_cents: 3050,
      sort_order: 0,
    })

    const productRow = screen.getByRole('row', { name: /Camiseta solidária/ })
    await user.click(within(productRow).getByRole('button', { name: 'Editar' }))

    const dialog = screen.getByRole('dialog', { name: 'Editar produto' })
    await user.clear(within(dialog).getByLabelText('Nome'))
    await user.type(within(dialog).getByLabelText('Nome'), 'Camiseta editada')
    await user.clear(within(dialog).getByLabelText('Preço (R$)'))
    await user.type(within(dialog).getByLabelText('Preço (R$)'), '35')
    await user.click(within(dialog).getByRole('button', { name: 'Salvar alterações' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Editar produto' })).not.toBeInTheDocument()
    })

    expect(updatedBodies[0]).toMatchObject({
      event_id: productEvent.id,
      name: 'Camiseta editada',
      price_cents: 3500,
    })
  })

  it('gerencia números de rifa do evento selecionado', async () => {
    const user = userEvent.setup()
    const createdBodies: unknown[] = []
    const updatedBodies: unknown[] = []
    mockEventList([activeEvent])
    server.use(
      http.get(`${REST}/raffle_numbers`, () => {
        return HttpResponse.json([raffleNumber])
      }),
      http.post(`${REST}/raffle_numbers`, async ({ request }) => {
        createdBodies.push(await request.json())
        return HttpResponse.json({ ...raffleNumber, number: 22 })
      }),
      http.patch(`${REST}/raffle_numbers`, async ({ request }) => {
        updatedBodies.push(await request.json())
        return HttpResponse.json({ ...raffleNumber, label: 'Número da sorte' })
      }),
    )

    renderWithProviders(<AdminEventsPage />)

    const eventRow = await screen.findByRole('row', { name: /Recãopensa Junho 2026/ })
    await user.click(within(eventRow).getByRole('button', { name: 'Itens' }))

    expect(
      await screen.findByRole('heading', { name: 'Números da rifa' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /21/ })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Número'), '22')
    await user.type(screen.getByLabelText('Rótulo'), 'Número da sorte')
    await user.click(screen.getByRole('button', { name: 'Cadastrar número' }))

    await waitFor(() => {
      expect(screen.getByText('Número 22 foi cadastrado.')).toBeInTheDocument()
    })

    expect(createdBodies[0]).toMatchObject({
      event_id: activeEvent.id,
      number: 22,
      label: 'Número da sorte',
      sort_order: 0,
    })

    const raffleRow = screen.getByRole('row', { name: /21/ })
    await user.click(within(raffleRow).getByRole('button', { name: 'Editar' }))

    const dialog = screen.getByRole('dialog', { name: 'Editar número' })
    await user.type(within(dialog).getByLabelText('Rótulo'), 'Número da sorte')
    await user.click(within(dialog).getByRole('button', { name: 'Salvar alterações' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Editar número' })).not.toBeInTheDocument()
    })

    expect(updatedBodies[0]).toMatchObject({
      event_id: activeEvent.id,
      number: 21,
      label: 'Número da sorte',
    })
  })

  it('lista reservas do evento e marca como paga', async () => {
    const user = userEvent.setup()
    const updatedBodies: unknown[] = []
    mockEventList([activeEvent])
    server.use(
      http.get(`${REST}/raffle_numbers`, () => {
        return HttpResponse.json([raffleNumber])
      }),
      http.get(`${REST}/reservations`, () => {
        return HttpResponse.json([reservation])
      }),
      http.patch(`${REST}/reservations`, async ({ request }) => {
        updatedBodies.push(await request.json())
        return HttpResponse.json({ ...reservation, status: 'paid' })
      }),
    )

    renderWithProviders(<AdminEventsPage />)

    const eventRow = await screen.findByRole('row', { name: /Recãopensa Junho 2026/ })
    await user.click(within(eventRow).getByRole('button', { name: 'Reservas' }))

    expect(
      await screen.findByRole('heading', { name: 'Reservas' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
    expect(screen.getByText('@maria')).toBeInTheDocument()
    expect(screen.getByText('Número 21')).toBeInTheDocument()
    expect(screen.getAllByText('Pendente').length).toBeGreaterThan(0)
    expect(screen.getByText('Prazo padrão: 6h')).toBeInTheDocument()

    const reservationRow = screen.getByRole('row', { name: /Maria Silva/ })
    await user.click(within(reservationRow).getByRole('button', { name: 'Pago' }))

    await waitFor(() => {
      expect(updatedBodies[0]).toEqual({ status: 'paid' })
    })
  })
})
