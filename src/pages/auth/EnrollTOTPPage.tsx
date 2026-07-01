import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { challengeFactor, enrollTOTP, listFactors, verifyFactor } from '../../features/auth/api'
import { useSession } from '../../features/auth/hooks'
import {
  authCardClass,
  authErrorClass,
  authLabelClass,
  authOtpInputClass,
  authShellClass,
  authSubmitClass,
  authTextClass,
  authTitleClass,
} from './authStyles'

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
    <div className={authShellClass}>
      <div className={authCardClass}>
        <h1 className={authTitleClass}>Configurar autenticador</h1>
        <p className={authTextClass}>
          Escaneie o QR code com Google Authenticator ou Authy e confirme com o código gerado.
        </p>
        {qrCode && (
          <img src={qrCode} alt="QR code TOTP" className="h-48 w-48 max-w-full self-center" />
        )}
        {secret && (
          <p className="break-all text-center text-xs text-gray-400 dark:text-gray-500">
            Chave manual: <span className="font-mono select-all">{secret}</span>
          </p>
        )}
        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          {error && <p id="enroll-totp-error" className={authErrorClass}>{error}</p>}
          <label htmlFor="enroll-totp-code" className={authLabelClass}>
            Código do autenticador
          </label>
          <input
            id="enroll-totp-code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            aria-describedby={error ? 'enroll-totp-error' : undefined}
            className={authOtpInputClass}
          />
          <button
            type="submit"
            disabled={loading || code.length < 6}
            className={authSubmitClass}
          >
            {loading ? 'Verificando…' : 'Confirmar e ativar'}
          </button>
        </form>
      </div>
    </div>
  )
}
