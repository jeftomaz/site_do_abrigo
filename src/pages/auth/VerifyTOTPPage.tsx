import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { challengeFactor, listFactors, verifyFactor } from '../../features/auth/api'
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
    <div className={authShellClass}>
      <form onSubmit={handleVerify} className={authCardClass}>
        <h1 className={authTitleClass}>Verificação em duas etapas</h1>
        <p className={authTextClass}>
          Abra seu app autenticador e insira o código de 6 dígitos.
        </p>
        {error && <p id="verify-totp-error" className={authErrorClass}>{error}</p>}
        <label htmlFor="verify-totp-code" className={authLabelClass}>
          Código do autenticador
        </label>
        <input
          id="verify-totp-code"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
          aria-describedby={error ? 'verify-totp-error' : undefined}
          className={authOtpInputClass}
        />
        <button
          type="submit"
          disabled={loading || code.length < 6 || !factorId}
          className={authSubmitClass}
        >
          {loading ? 'Verificando…' : 'Verificar'}
        </button>
      </form>
    </div>
  )
}
