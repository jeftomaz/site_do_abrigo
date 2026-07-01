import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/render'
import Header from './Header'

describe('Header', () => {
  it('expõe link para pular direto ao conteúdo principal', () => {
    renderWithProviders(<Header />)

    expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveAttribute(
      'href',
      '#main-content',
    )
  })

  it('abre e fecha o menu mobile', async () => {
    renderWithProviders(<Header />)

    expect(screen.queryByRole('navigation', { name: 'Menu mobile' })).not.toBeInTheDocument()

    const menuButton = screen.getByRole('button', { name: 'Abrir menu' })
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')

    await userEvent.click(menuButton)

    const mobileMenu = screen.getByRole('navigation', { name: 'Menu mobile' })
    expect(mobileMenu).toHaveAttribute('id', 'mobile-menu')
    expect(within(mobileMenu).getByRole('link', { name: 'Adoção' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await userEvent.click(within(mobileMenu).getByRole('link', { name: 'Adoção' }))

    expect(screen.queryByRole('navigation', { name: 'Menu mobile' })).not.toBeInTheDocument()
  })
})
