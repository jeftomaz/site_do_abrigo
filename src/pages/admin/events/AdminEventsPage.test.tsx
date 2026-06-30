import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import type { Event } from '../../../features/events/types'
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
})
