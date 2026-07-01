import { useState, type ReactNode } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

function Fixture({
  open = true,
  onClose = vi.fn(),
  title,
  children = 'Conteúdo do modal',
  footer,
}: {
  open?: boolean
  onClose?: () => void
  title?: string
  children?: ReactNode
  footer?: ReactNode
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} footer={footer}>
      {children}
    </Modal>
  )
}

function FocusFixture() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Teste">
        Conteúdo do modal
      </Modal>
    </>
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

  it('limita altura e permite scroll interno em telas pequenas', () => {
    render(<Fixture />)
    const dialog = screen.getByRole('dialog')
    const scrollRegion = dialog.querySelector('.overflow-y-auto')
    expect(dialog).toHaveClass('max-h-[100dvh]', 'overflow-hidden')
    expect(scrollRegion).toHaveTextContent('Conteúdo do modal')
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

  it('move foco para o modal e restaura foco ao fechar', async () => {
    render(<FocusFixture />)

    const trigger = screen.getByRole('button', { name: 'Abrir modal' })
    await userEvent.click(trigger)

    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(trigger).toHaveFocus()
  })

  it('mantém navegação por Tab dentro do modal', async () => {
    render(
      <Fixture
        title="Teste"
        footer={<button type="button">Salvar</button>}
      >
        <button type="button">Ação interna</button>
      </Fixture>,
    )

    const closeButton = screen.getByRole('button', { name: 'Fechar' })
    const saveButton = screen.getByRole('button', { name: 'Salvar' })

    expect(closeButton).toHaveFocus()

    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    expect(saveButton).toHaveFocus()

    await userEvent.tab()
    expect(closeButton).toHaveFocus()
  })
})
