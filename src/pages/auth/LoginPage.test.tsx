import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/render'
import LoginPage from './LoginPage'

describe('LoginPage', () => {
  it('usa superfícies e controles com variantes dark', () => {
    renderWithProviders(<LoginPage />)

    const heading = screen.getByRole('heading', { name: 'Entrar' })
    expect(heading).toHaveClass('dark:text-gray-100')
    expect(heading.closest('form')).toHaveClass('dark:bg-gray-900')
    expect(screen.getByLabelText('E-mail')).toHaveClass('dark:bg-gray-800')
    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveClass('dark:bg-blue-500')
  })

  it('rotula campos de login por nome acessível', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByRole('textbox', { name: 'E-mail' })).toBeRequired()
    expect(screen.getByLabelText('Senha')).toBeRequired()
  })
})
