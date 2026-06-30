import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DoacaoSection from './DoacaoSection'

const clipboardMock = { writeText: vi.fn().mockResolvedValue(undefined) }

beforeEach(() => {
  clipboardMock.writeText.mockClear()
  Object.defineProperty(navigator, 'clipboard', {
    value: clipboardMock,
    writable: true,
    configurable: true,
  })
})

describe('DoacaoSection', () => {
  it('exibe a chave PIX', () => {
    render(<DoacaoSection />)
    expect(screen.getByText('abrigodamarcia@gmail.com')).toBeInTheDocument()
  })

  it('"Copiar chave" chama clipboard.writeText com a chave PIX', async () => {
    render(<DoacaoSection />)
    await userEvent.click(screen.getByRole('button', { name: 'Copiar chave' }))
    expect(clipboardMock.writeText).toHaveBeenCalledOnce()
    expect(clipboardMock.writeText).toHaveBeenCalledWith('abrigodamarcia@gmail.com')
  })

  it('mostra "Copiado!" após clicar em "Copiar chave"', async () => {
    render(<DoacaoSection />)
    await userEvent.click(screen.getByRole('button', { name: 'Copiar chave' }))
    expect(screen.getByRole('button', { name: 'Copiado!' })).toBeInTheDocument()
  })

  it('restaura "Copiar chave" após 2 s', async () => {
    vi.useFakeTimers()
    try {
      render(<DoacaoSection />)
      fireEvent.click(screen.getByRole('button', { name: 'Copiar chave' }))
      expect(screen.getByRole('button', { name: 'Copiado!' })).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(2000))
      expect(screen.getByRole('button', { name: 'Copiar chave' })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
