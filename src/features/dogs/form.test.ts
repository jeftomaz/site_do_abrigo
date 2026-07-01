import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  dogFormValuesToPayload,
  dogToFormValues,
  emptyDogFormValues,
  validateAgeYears,
} from './form'
import type { Dog } from './types'

const FIXED_YEAR = 2026
const FIXED_DATE = new Date(`${FIXED_YEAR}-06-30`)

const dogBase: Dog = {
  id: 'test-id',
  name: 'Rex',
  size: 'médio',
  birth_year: 2020,
  description: 'Um bom cão',
  photos: null,
  status: 'available',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('emptyDogFormValues', () => {
  it('retorna strings vazias para todos os campos', () => {
    const values = emptyDogFormValues()
    expect(values.name).toBe('')
    expect(values.size).toBe('')
    expect(values.ageYears).toBe('')
    expect(values.description).toBe('')
  })
})

describe('dogToFormValues — conversão ano→idade', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_DATE)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('mapeia todos os campos corretamente', () => {
    const values = dogToFormValues(dogBase)
    expect(values.name).toBe('Rex')
    expect(values.size).toBe('médio')
    expect(values.ageYears).toBe('6') // 2026 - 2020
    expect(values.description).toBe('Um bom cão')
  })

  it('usa strings vazias para campos nulos', () => {
    const dog: Dog = { ...dogBase, size: null, birth_year: null, description: null }
    const values = dogToFormValues(dog)
    expect(values.size).toBe('')
    expect(values.ageYears).toBe('')
    expect(values.description).toBe('')
  })

  it('retorna "" para birth_year no futuro', () => {
    const dog: Dog = { ...dogBase, birth_year: FIXED_YEAR + 1 }
    expect(dogToFormValues(dog).ageYears).toBe('')
  })

  it('retorna "0" quando nascido no ano atual', () => {
    const dog: Dog = { ...dogBase, birth_year: FIXED_YEAR }
    expect(dogToFormValues(dog).ageYears).toBe('0')
  })
})

describe('dogFormValuesToPayload — conversão idade→ano', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_DATE)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('faz trim de name e description', () => {
    const payload = dogFormValuesToPayload({
      name: '  Rex  ',
      size: 'médio',
      ageYears: '5',
      description: '  Bom cão  ',
    })
    expect(payload.name).toBe('Rex')
    expect(payload.description).toBe('Bom cão')
  })

  it('converte ageYears para birth_year (FIXED_YEAR - idade)', () => {
    const payload = dogFormValuesToPayload({
      name: 'Rex',
      size: '',
      ageYears: '6',
      description: '',
    })
    expect(payload.birth_year).toBe(FIXED_YEAR - 6)
  })

  it('converte ageYears vazio para birth_year null', () => {
    const payload = dogFormValuesToPayload({ name: 'Rex', size: '', ageYears: '', description: '' })
    expect(payload.birth_year).toBeNull()
  })

  it('converte size vazio para null', () => {
    const payload = dogFormValuesToPayload({ name: 'Rex', size: '', ageYears: '', description: '' })
    expect(payload.size).toBeNull()
  })

  it('converte description só-espaços para null', () => {
    const payload = dogFormValuesToPayload({ name: 'Rex', size: '', ageYears: '', description: '   ' })
    expect(payload.description).toBeNull()
  })

  it('mantém description não-vazia após trim', () => {
    const payload = dogFormValuesToPayload({ name: 'Rex', size: '', ageYears: '', description: ' Texto ' })
    expect(payload.description).toBe('Texto')
  })
})

describe('validateAgeYears', () => {
  it('aceita string vazia (campo opcional)', () => {
    expect(validateAgeYears('')).toBe(true)
  })

  it('aceita string só de espaços (tratada como vazia)', () => {
    expect(validateAgeYears('  ')).toBe(true)
  })

  it('aceita 0 (menos de 1 ano)', () => {
    expect(validateAgeYears('0')).toBe(true)
  })

  it('aceita inteiro válido', () => {
    expect(validateAgeYears('5')).toBe(true)
  })

  it('aceita valor máximo 40', () => {
    expect(validateAgeYears('40')).toBe(true)
  })

  it('rejeita número decimal', () => {
    expect(validateAgeYears('1.5')).toBe('Use um número inteiro.')
  })

  it('rejeita string não-numérica', () => {
    expect(validateAgeYears('abc')).toBe('Use um número inteiro.')
  })

  it('rejeita número negativo', () => {
    expect(validateAgeYears('-1')).toBe('A idade não pode ser negativa.')
  })

  it('rejeita idade acima de 40', () => {
    expect(validateAgeYears('41')).toBe('Confira a idade informada.')
  })
})
