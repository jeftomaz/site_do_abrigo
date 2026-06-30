import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'renderiza variante %s',
    (variant) => {
      render(<Button variant={variant}>Click</Button>)
      expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument()
    },
  )

  it('isLoading exibe spinner e desabilita o botão', () => {
    render(<Button isLoading>Salvar</Button>)
    const btn = screen.getByRole('button', { name: 'Salvar' })
    expect(btn).toBeDisabled()
    expect(btn.querySelector('span[aria-hidden]')).toBeInTheDocument()
  })

  it('disabled desabilita o botão', () => {
    render(<Button disabled>OK</Button>)
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled()
  })

  it('chama onClick ao clicar', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('não chama onClick quando desabilitado', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(handler).not.toHaveBeenCalled()
  })
})
