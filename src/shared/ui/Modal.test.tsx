import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

function Fixture({
  open = true,
  onClose = vi.fn(),
  title,
}: {
  open?: boolean
  onClose?: () => void
  title?: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      Conteúdo do modal
    </Modal>
  )
}

describe('Modal', () => {
  it('renderiza conteúdo quando open=true', () => {
    render(<Fixture />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument()
  })

  it('não renderiza quando open=false', () => {
    render(<Fixture open={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('tem aria-modal="true"', () => {
    render(<Fixture />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('exibe título e aria-labelledby quando title fornecido', () => {
    render(<Fixture title="Meu Modal" />)
    expect(screen.getByText('Meu Modal')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('sem title não define aria-labelledby', () => {
    render(<Fixture />)
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby')
  })

  it('fecha ao clicar no backdrop (fora do dialog)', () => {
    const onClose = vi.fn()
    render(<Fixture onClose={onClose} />)
    const backdrop = screen.getByRole('dialog').parentElement!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('não fecha ao clicar dentro do dialog', async () => {
    const onClose = vi.fn()
    render(<Fixture onClose={onClose} />)
    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('fecha ao pressionar Escape', async () => {
    const onClose = vi.fn()
    render(<Fixture onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('fecha ao clicar no botão Fechar (quando há title)', async () => {
    const onClose = vi.fn()
    render(<Fixture onClose={onClose} title="Teste" />)
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('não registra listener de Escape quando fechado', async () => {
    const onClose = vi.fn()
    render(<Fixture open={false} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })
})
