import { describe, expect, it } from 'vitest'
import { storyCoverUrl, storyPhotoUrl } from './format'

describe('storyCoverUrl', () => {
  it('retorna null para photos null', () => {
    expect(storyCoverUrl(null)).toBeNull()
  })

  it('retorna null para array vazio', () => {
    expect(storyCoverUrl([])).toBeNull()
  })

  it('retorna URL da primeira foto', () => {
    const result = storyCoverUrl(['first.jpg', 'second.jpg'])
    expect(result).toContain('first.jpg')
    expect(result).not.toContain('second.jpg')
  })

  it('funciona com array de uma foto', () => {
    const result = storyCoverUrl(['only.jpg'])
    expect(result).toContain('only.jpg')
  })
})

describe('storyPhotoUrl', () => {
  it('retorna string contendo o path informado', () => {
    const result = storyPhotoUrl('folder/photo.jpg')
    expect(typeof result).toBe('string')
    expect(result).toContain('folder/photo.jpg')
  })

  it('inclui o nome do bucket na URL', () => {
    const result = storyPhotoUrl('photo.jpg')
    expect(result).toContain('stories')
  })
})
