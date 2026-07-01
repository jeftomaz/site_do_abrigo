import { render, screen } from '@testing-library/react'
import { PageLoadingFallback, SkeletonRows } from './Skeleton'

describe('Skeleton', () => {
  it('renderiza linhas de skeleton sem expor conteudo para leitores de tela', () => {
    const { container } = render(<SkeletonRows rows={3} />)

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renderiza fallback de pagina com status acessivel', () => {
    render(<PageLoadingFallback title="Carregando painel..." />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando painel...',
    )
  })
})
