import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './theme'

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('aplica a classe dark na raiz ao alternar o tema', async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(document.documentElement).not.toHaveClass('dark')

    await userEvent.click(screen.getByRole('button', { name: 'light' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
