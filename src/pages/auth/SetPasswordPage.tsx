import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../shared/lib/supabase'
import {
  authCardClass,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authShellClass,
  authSubmitClass,
  authTextClass,
  authTitleClass,
} from './authStyles'

export default function SetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/admin', { replace: true })
  }

  return (
    <div className={authShellClass}>
      <form
        onSubmit={handleSubmit}
        className={authCardClass}
      >
        <h1 className={authTitleClass}>Defina sua senha</h1>
        <p className={authTextClass}>
          Crie uma senha para acessar o painel de administração.
        </p>
        {error && <p id="set-password-error" className={authErrorClass}>{error}</p>}
        <label htmlFor="new-password" className={authLabelClass}>
          Nova senha
        </label>
        <input
          id="new-password"
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          aria-describedby={error ? 'set-password-error' : undefined}
          className={authInputClass}
        />
        <label htmlFor="confirm-password" className={authLabelClass}>
          Confirmar senha
        </label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Confirmar senha"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          aria-describedby={error ? 'set-password-error' : undefined}
          className={authInputClass}
        />
        <button
          type="submit"
          disabled={loading}
          className={authSubmitClass}
        >
          {loading ? 'Salvando…' : 'Definir senha'}
        </button>
      </form>
    </div>
  )
}
