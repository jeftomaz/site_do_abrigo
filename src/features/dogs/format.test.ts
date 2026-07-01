import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dogAgeLabel, dogCoverUrl, dogPhotoUrl } from './format'

const FIXED_YEAR = 2026
const FIXED_DATE = new Date(`${FIXED_YEAR}-06-30`)

describe('dogAgeLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_DATE)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna null para birth_year null', () => {
    expect(dogAgeLabel(null)).toBeNull()
  })

  it('retorna null quando birth_year está no futuro', () => {
    expect(dogAgeLabel(FIXED_YEAR + 1)).toBeNull()
  })

  it('retorna "menos de 1 ano" quando nascido no ano atual', () => {
    expect(dogAgeLabel(FIXED_YEAR)).toBe('menos de 1 ano')
  })

  it('retorna "1 ano" quando nascido há 1 ano', () => {
    expect(dogAgeLabel(FIXED_YEAR - 1)).toBe('1 ano')
  })

  it('retorna plural para idades maiores que 1', () => {
    expect(dogAgeLabel(FIXED_YEAR - 5)).toBe('5 anos')
    expect(dogAgeLabel(FIXED_YEAR - 10)).toBe('10 anos')
  })
})

describe('dogCoverUrl', () => {
  it('retorna null para photos null', () => {
    expect(dogCoverUrl(null)).toBeNull()
  })

  it('retorna null para array vazio', () => {
    expect(dogCoverUrl([])).toBeNull()
  })

  it('retorna URL da primeira foto', () => {
    const result = dogCoverUrl(['first.jpg', 'second.jpg'])
    expect(result).toContain('first.jpg')
    expect(result).not.toContain('second.jpg')
  })

  it('funciona com array de uma foto', () => {
    const result = dogCoverUrl(['only.jpg'])
    expect(result).toContain('only.jpg')
  })
})

describe('dogPhotoUrl', () => {
  it('retorna string contendo o path informado', () => {
    const result = dogPhotoUrl('folder/photo.jpg')
    expect(typeof result).toBe('string')
    expect(result).toContain('folder/photo.jpg')
  })

  it('inclui o nome do bucket na URL', () => {
    const result = dogPhotoUrl('photo.jpg')
    expect(result).toContain('dogs')
  })
})
