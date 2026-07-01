import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Dog } from '../types'
import { DogCard } from './DogCard'

const baseDog: Dog = {
  id: 'dog-1',
  name: 'Rex',
  size: 'Médio',
  birth_year: new Date().getFullYear() - 3,
  description: null,
  photos: null,
  status: 'available',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('DogCard', () => {
  it('exibe o nome do cão', () => {
    render(<DogCard dog={baseDog} />)
    expect(screen.getByText('Rex')).toBeInTheDocument()
  })

  it('exibe porte e idade na meta line', () => {
    render(<DogCard dog={baseDog} />)
    expect(screen.getByText(/Médio/)).toBeInTheDocument()
    expect(screen.getByText(/3 anos/)).toBeInTheDocument()
  })

  it('exibe fallback 🐾 quando não há fotos', () => {
    render(<DogCard dog={{ ...baseDog, photos: null }} />)
    expect(screen.getByText('🐾')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('exibe imagem quando há fotos', () => {
    render(<DogCard dog={{ ...baseDog, photos: ['dogs/rex.jpg'] }} />)
    expect(screen.getByAltText('Foto de Rex')).toBeInTheDocument()
    expect(screen.queryByText('🐾')).not.toBeInTheDocument()
  })

  it('sem onClick não tem role=button', () => {
    render(<DogCard dog={baseDog} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('com onClick tem role=button e tabIndex=0', () => {
    render(<DogCard dog={baseDog} onClick={vi.fn()} />)
    const card = screen.getByRole('button')
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute('tabindex', '0')
  })

  it('dispara callback ao clicar', async () => {
    const onClick = vi.fn()
    render(<DogCard dog={baseDog} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledWith(baseDog)
  })

  it('dispara callback ao pressionar Enter', async () => {
    const onClick = vi.fn()
    render(<DogCard dog={baseDog} onClick={onClick} />)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledWith(baseDog)
  })

  it('dispara callback ao pressionar Espaço', async () => {
    const onClick = vi.fn()
    render(<DogCard dog={baseDog} onClick={onClick} />)
    screen.getByRole('button').focus()
    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledWith(baseDog)
  })
})
