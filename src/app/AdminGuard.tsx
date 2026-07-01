import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getAssuranceLevel, listFactors } from '../features/auth/api'
import { useSession } from '../features/auth/hooks'
import { PageLoadingFallback } from '../shared/ui/Skeleton'
import { StateMessage } from '../shared/ui/StateMessage'

type State = 'loading' | 'no-session' | 'needs-enroll' | 'needs-verify' | 'ok' | 'error'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const session = useSession()
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    if (session === undefined) return
    if (!session) { setState('no-session'); return }

    async function check() {
      try {
        const [{ data: aalData }, { data: factors }] = await Promise.all([
          getAssuranceLevel(),
          listFactors(),
        ])

        if (aalData?.currentLevel === 'aal2') { setState('ok'); return }

        const enrolled = (factors?.totp ?? []).some(f => f.status === 'verified')
        setState(enrolled ? 'needs-verify' : 'needs-enroll')
      } catch {
        setState('error')
      }
    }
    check()
  }, [session])

  if (state === 'loading') return <PageLoadingFallback title="Verificando acesso..." />
  if (state === 'error') {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <StateMessage variant="error">
          Não foi possível verificar seu acesso ao painel. Tente entrar novamente em alguns instantes.
        </StateMessage>
      </main>
    )
  }
  if (state === 'no-session') return <Navigate to="/admin/login" replace />
  if (state === 'needs-enroll') return <Navigate to="/admin/enroll" replace />
  if (state === 'needs-verify') return <Navigate to="/admin/verify" replace />
  return <>{children}</>
}
