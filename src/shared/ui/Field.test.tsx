import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import Field from './Field'

describe('Field', () => {
  it('renderiza label associada ao input', () => {
    render(<Field label="Nome" />)
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
  })

  it('exibe mensagem de erro', () => {
    render(<Field label="Email" error="Campo obrigatório" />)
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
  })

  it('exibe hint quando sem erro', () => {
    render(<Field label="Email" hint="Use seu e-mail principal" />)
    expect(screen.getByText('Use seu e-mail principal')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Use seu e-mail principal')
  })

  it('oculta hint quando há erro', () => {
    render(<Field label="Email" hint="Dica" error="Inválido" />)
    expect(screen.queryByText('Dica')).not.toBeInTheDocument()
    expect(screen.getByText('Inválido')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Inválido')
  })

  it('renderiza como textarea quando as="textarea"', () => {
    render(<Field as="textarea" label="Descrição" />)
    expect(screen.getByLabelText('Descrição').tagName).toBe('TEXTAREA')
  })

  it('aceita digitação', async () => {
    render(<Field label="Nome" />)
    const input = screen.getByLabelText('Nome')
    await userEvent.type(input, 'Rex')
    expect(input).toHaveValue('Rex')
  })

  it('integra com register do react-hook-form', async () => {
    function TestForm() {
      const { register } = useForm<{ nome: string }>()
      return <Field label="Nome" {...register('nome')} />
    }
    render(<TestForm />)
    const input = screen.getByLabelText('Nome')
    await userEvent.type(input, 'Rex')
    expect(input).toHaveValue('Rex')
  })
})
