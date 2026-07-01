import { render, screen } from '@testing-library/react'
import { StateMessage } from './StateMessage'

describe('StateMessage', () => {
  it('renderiza estado vazio sem role de alerta', () => {
    render(<StateMessage>Nenhum item cadastrado.</StateMessage>)

    expect(screen.getByText('Nenhum item cadastrado.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renderiza estado de erro como alerta', () => {
    render(
      <StateMessage variant="error" title="Falha ao carregar">
        Tente novamente mais tarde.
      </StateMessage>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao carregar')
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tente novamente mais tarde.',
    )
  })
})
