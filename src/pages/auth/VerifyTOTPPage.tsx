import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { challengeFactor, listFactors, verifyFactor } from '../../features/auth/api'
import { useSession } from '../../features/auth/hooks'

export default function VerifyTOTPPage() {
  const navigate = useNavigate()
  const session = useSession()
  const [factorId, setFactorId] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session === undefined) return
    if (!session) { navigate('/admin/login', { replace: true }); return }

    listFactors().then(({ data }) => {
      const verified = (data?.totp ?? []).filter(f => f.status === 'verified')
      if (verified.length === 0) { navigate('/admin/enroll', { replace: true }); return }
      setFactorId(verified[0].id)
    })
  }, [session, navigate])

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { data: challenge, error: challengeErr } = await challengeFactor(factorId)
    if (challengeErr || !challenge) {
      setError(challengeErr?.message ?? 'Erro ao criar desafio')
      setLoading(false)
      return
    }
    const { error: verifyErr } = await verifyFactor(factorId, challenge.id, code)
    setLoading(false)
    if (verifyErr) { setError(verifyErr.message); return }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleVerify} className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold">Verificação em duas etapas</h1>
        <p className="text-sm text-gray-600">
          Abra seu app autenticador e insira o código de 6 dígitos.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="text"
          inputMode="numeric"
          placeholder="000000"
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
          className="border rounded px-3 py-2 text-center tracking-widest text-lg outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
        >
          {loading ? 'Verificando…' : 'Verificar'}
        </button>
      </form>
    </div>
  )
}
