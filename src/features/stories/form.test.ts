import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  emptyStoryFormValues,
  storyFormValuesToPayload,
  storyToFormValues,
} from './form'
import type { Story } from './types'

const FIXED_DATE = '2026-06-30'

const storyBase: Story = {
  id: 'story-id',
  dog_id: 'dog-id',
  title: 'Uma história',
  body: 'Era uma vez...',
  photos: null,
  published_at: '2026-01-01',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('emptyStoryFormValues', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(FIXED_DATE))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna strings vazias para title, body e dog_id', () => {
    const values = emptyStoryFormValues()
    expect(values.title).toBe('')
    expect(values.body).toBe('')
    expect(values.dog_id).toBe('')
  })

  it('usa a data de hoje como published_at', () => {
    const values = emptyStoryFormValues()
    expect(values.published_at).toBe(FIXED_DATE)
  })
})

describe('storyToFormValues', () => {
  it('mapeia todos os campos corretamente', () => {
    const values = storyToFormValues(storyBase)
    expect(values.title).toBe('Uma história')
    expect(values.body).toBe('Era uma vez...')
    expect(values.dog_id).toBe('dog-id')
    expect(values.published_at).toBe('2026-01-01')
  })

  it('converte dog_id null para string vazia', () => {
    const story: Story = { ...storyBase, dog_id: null }
    expect(storyToFormValues(story).dog_id).toBe('')
  })
})

describe('storyFormValuesToPayload', () => {
  it('faz trim de title e body', () => {
    const payload = storyFormValuesToPayload({
      title: '  Título  ',
      body: '  Corpo  ',
      dog_id: '',
      published_at: '2026-01-01',
    })
    expect(payload.title).toBe('Título')
    expect(payload.body).toBe('Corpo')
  })

  it('converte dog_id vazio para null', () => {
    const payload = storyFormValuesToPayload({
      title: 'T',
      body: 'B',
      dog_id: '',
      published_at: '2026-01-01',
    })
    expect(payload.dog_id).toBeNull()
  })

  it('mantém dog_id não-vazio', () => {
    const payload = storyFormValuesToPayload({
      title: 'T',
      body: 'B',
      dog_id: 'some-uuid',
      published_at: '2026-01-01',
    })
    expect(payload.dog_id).toBe('some-uuid')
  })

  it('preserva published_at sem alteração', () => {
    const payload = storyFormValuesToPayload({
      title: 'T',
      body: 'B',
      dog_id: '',
      published_at: '2026-03-15',
    })
    expect(payload.published_at).toBe('2026-03-15')
  })
})
