import { http, HttpResponse } from 'msw'
import type { Event } from '../../features/events/types'
import type { Dog } from '../../features/dogs/types'
import type { Story } from '../../features/stories/types'

const REST = `${import.meta.env.VITE_SUPABASE_URL as string}/rest/v1`

export const eventFixture: Event = {
  id: '00000000-0000-0000-0000-000000000901',
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

export const dogFixture: Dog = {
  id: 'dog-fixture-1',
  name: 'Rex',
  size: 'médio',
  birth_year: 2020,
  description: 'Cão dócil e brincalhão',
  photos: null,
  status: 'available',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

export const storyFixture: Story = {
  id: 'story-fixture-1',
  dog_id: null,
  title: 'Uma história feliz',
  body: 'Era uma vez um cão que encontrou um lar cheio de amor.',
  photos: null,
  published_at: '2026-01-01',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

// Para sobrescrever um handler dentro de um teste, use server.use() com afterEach resetHandlers:
//
//   import { http, HttpResponse } from 'msw'
//   import { server } from '../test/msw/server'
//
//   it('exibe mensagem de lista vazia', async () => {
//     server.use(
//       http.get(`${REST}/dogs`, () => HttpResponse.json([])),
//     )
//     // ... renderWithProviders(<MeuComponente />) e asserts
//   })
//
// O server.resetHandlers() em afterEach (setup.ts) desfaz a sobrescrita após cada teste.

export const handlers = [
  http.get(`${REST}/events`, () => {
    return HttpResponse.json(eventFixture)
  }),

  http.get(`${REST}/dogs`, () => {
    return HttpResponse.json([dogFixture])
  }),

  http.get(`${REST}/stories`, () => {
    return HttpResponse.json([storyFixture])
  }),
]
