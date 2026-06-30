import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { challengeFactor, enrollTOTP, listFactors, verifyFactor } from '../../features/auth/api'
import { useSession } from '../../features/auth/hooks'

export default function EnrollTOTPPage() {
  const navigate = useNavigate()
  const session = useSession()
  const [factorId, setFactorId] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session === undefined) return
    if (!session) { navigate('/admin/login', { replace: true }); return }

    async function start() {
      const { data: factors } = await listFactors()
      const alreadyEnrolled = (factors?.totp ?? []).some(f => f.status === 'verified')
      if (alreadyEnrolled) { navigate('/admin/verify', { replace: true }); return }

      const { data, error } = await enrollTOTP()
      if (error || !data) return
      setFactorId(data.id)
      if (data.type === 'totp') {
        setQrCode(data.totp.qr_code)
        setSecret(data.totp.secret)
      }
    }
    start()
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
      <div className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold">Configurar autenticador</h1>
        <p className="text-sm text-gray-600">
          Escaneie o QR code com Google Authenticator ou Authy e confirme com o código gerado.
        </p>
        {qrCode && (
          <img src={qrCode} alt="QR code TOTP" className="w-48 h-48 self-center" />
        )}
        {secret && (
          <p className="text-xs text-gray-400 text-center break-all">
            Chave manual: <span className="font-mono select-all">{secret}</span>
          </p>
        )}
        <form onSubmit={handleVerify} className="flex flex-col gap-3">
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
            {loading ? 'Verificando…' : 'Confirmar e ativar'}
          </button>
        </form>
      </div>
    </div>
  )
}
