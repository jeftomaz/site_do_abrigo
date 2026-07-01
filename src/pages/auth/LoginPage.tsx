import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../features/auth/api'
import {
  authCardClass,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authShellClass,
  authSubmitClass,
  authTitleClass,
} from './authStyles'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/admin')
  }

  return (
    <div className={authShellClass}>
      <form onSubmit={handleSubmit} className={authCardClass}>
        <h1 className={authTitleClass}>Entrar</h1>
        {error && <p id="login-error" className={authErrorClass}>{error}</p>}
        <label htmlFor="login-email" className={authLabelClass}>
          E-mail
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-describedby={error ? 'login-error' : undefined}
          className={authInputClass}
        />
        <label htmlFor="login-password" className={authLabelClass}>
          Senha
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-describedby={error ? 'login-error' : undefined}
          className={authInputClass}
        />
        <button
          type="submit"
          disabled={loading}
          className={authSubmitClass}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
