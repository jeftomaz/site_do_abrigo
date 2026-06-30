import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../shared/lib/supabase'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded-lg shadow-sm"
      >
        <h1 className="text-xl font-semibold">Defina sua senha</h1>
        <p className="text-sm text-gray-600">
          Crie uma senha para acessar o painel de administração.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
        >
          {loading ? 'Salvando…' : 'Definir senha'}
        </button>
      </form>
    </div>
  )
}
