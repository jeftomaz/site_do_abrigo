import { describe, expect, it } from 'vitest'
import { sortDogs } from './sort'
import type { Dog } from './types'

function makeDog(overrides: Partial<Dog>): Dog {
  return {
    id: crypto.randomUUID(),
    name: 'Dog',
    size: null,
    birth_year: null,
    description: null,
    photos: null,
    status: 'available',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('sortDogs — name (A→Z)', () => {
  it('ordena alfabeticamente pelo nome', () => {
    const dogs = [
      makeDog({ name: 'Charlie' }),
      makeDog({ name: 'Alfa' }),
      makeDog({ name: 'Beta' }),
    ]
    const result = sortDogs(dogs, 'name')
    expect(result.map(d => d.name)).toEqual(['Alfa', 'Beta', 'Charlie'])
  })

  it('não muta o array original', () => {
    const dogs = [makeDog({ name: 'B' }), makeDog({ name: 'A' })]
    const result = sortDogs(dogs, 'name')
    expect(result).not.toBe(dogs)
    expect(dogs[0].name).toBe('B')
  })
})

describe('sortDogs — age_desc (mais novo)', () => {
  const newer = makeDog({ name: 'Newer', birth_year: 2022 })
  const older = makeDog({ name: 'Older', birth_year: 2018 })
  const noYear = makeDog({ name: 'NoYear', birth_year: null })

  it('coloca birth_year maior primeiro (mais jovem primeiro)', () => {
    const result = sortDogs([older, newer], 'age_desc')
    expect(result.map(d => d.name)).toEqual(['Newer', 'Older'])
  })

  // null no FIM → insertion sort insere noYear como `a` contra `b` com valor,
  // cobrindo o branch "if (a.birth_year == null) return 1"
  it('move birth_year null para o fim (null no fim do input)', () => {
    const result = sortDogs([newer, older, noYear], 'age_desc')
    expect(result[result.length - 1].name).toBe('NoYear')
  })

  // null no INÍCIO → insertion sort chama comparator(valued, noYear), cobrindo b.birth_year == null
  it('move birth_year null para o fim (null no início do input)', () => {
    const result = sortDogs([noYear, newer, older], 'age_desc')
    expect(result[result.length - 1].name).toBe('NoYear')
  })

  it('dois nulls mantêm ordem relativa entre si', () => {
    const a = makeDog({ name: 'A', birth_year: null })
    const b = makeDog({ name: 'B', birth_year: null })
    const result = sortDogs([a, b], 'age_desc')
    expect(result.map(d => d.name)).toEqual(['A', 'B'])
  })
})

describe('sortDogs — age_asc (mais velho)', () => {
  const newer = makeDog({ name: 'Newer', birth_year: 2022 })
  const older = makeDog({ name: 'Older', birth_year: 2018 })
  const noYear = makeDog({ name: 'NoYear', birth_year: null })

  it('coloca birth_year menor primeiro (mais velho primeiro)', () => {
    const result = sortDogs([newer, older], 'age_asc')
    expect(result.map(d => d.name)).toEqual(['Older', 'Newer'])
  })

  it('move birth_year null para o fim (null no fim do input)', () => {
    const result = sortDogs([older, newer, noYear], 'age_asc')
    expect(result[result.length - 1].name).toBe('NoYear')
  })

  it('move birth_year null para o fim (null no início do input)', () => {
    const result = sortDogs([noYear, newer, older], 'age_asc')
    expect(result[result.length - 1].name).toBe('NoYear')
  })

  it('dois nulls mantêm ordem relativa entre si', () => {
    const a = makeDog({ name: 'A', birth_year: null })
    const b = makeDog({ name: 'B', birth_year: null })
    const result = sortDogs([a, b], 'age_asc')
    expect(result.map(d => d.name)).toEqual(['A', 'B'])
  })
})

describe('sortDogs — size (porte)', () => {
  const filhote = makeDog({ name: 'Filhote', size: 'filhote' })
  const pequeno = makeDog({ name: 'Pequeno', size: 'pequeno' })
  const medio   = makeDog({ name: 'Médio',   size: 'médio' })
  const grande  = makeDog({ name: 'Grande',  size: 'grande' })
  const gigante = makeDog({ name: 'Gigante', size: 'gigante' })
  const unknown = makeDog({ name: 'Unknown', size: null })

  it('ordena filhote → pequeno → médio → grande → gigante', () => {
    const result = sortDogs([gigante, medio, filhote, grande, pequeno], 'size')
    expect(result.map(d => d.name)).toEqual(['Filhote', 'Pequeno', 'Médio', 'Grande', 'Gigante'])
  })

  // null no FIM → insertion sort insere unknown como `a`, cobrindo o ?? 99 em aOrd
  it('move size null para o fim (null no fim do input)', () => {
    const result = sortDogs([filhote, medio, unknown], 'size')
    expect(result[result.length - 1].name).toBe('Unknown')
  })

  // null no INÍCIO → insertion sort chama comparator(sized, unknown), cobrindo ?? 99 em bOrd
  it('move size null para o fim (null no início do input)', () => {
    const result = sortDogs([unknown, medio, filhote], 'size')
    expect(result[result.length - 1].name).toBe('Unknown')
  })

  it('size com letras maiúsculas é tratado de forma case-insensitive', () => {
    const upper = makeDog({ name: 'Upper', size: 'FILHOTE' })
    const result = sortDogs([medio, upper], 'size')
    expect(result[0].name).toBe('Upper')
  })

  it('size desconhecido (não mapeado) vai para o fim', () => {
    const weird = makeDog({ name: 'Weird', size: 'enorme' })
    const result = sortDogs([filhote, weird], 'size')
    expect(result[0].name).toBe('Filhote')
    expect(result[1].name).toBe('Weird')
  })
})
