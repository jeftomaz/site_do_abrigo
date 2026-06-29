import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getAssuranceLevel, listFactors } from '../features/auth/api'
import { useSession } from '../features/auth/hooks'

type State = 'loading' | 'no-session' | 'needs-enroll' | 'needs-verify' | 'ok'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const session = useSession()
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    if (session === undefined) return
    if (!session) { setState('no-session'); return }

    async function check() {
      const [{ data: aalData }, { data: factors }] = await Promise.all([
        getAssuranceLevel(),
        listFactors(),
      ])

      if (aalData?.currentLevel === 'aal2') { setState('ok'); return }

      const enrolled = (factors?.totp ?? []).some(f => f.status === 'verified')
      setState(enrolled ? 'needs-verify' : 'needs-enroll')
    }
    check()
  }, [session])

  if (state === 'loading') return null
  if (state === 'no-session') return <Navigate to="/admin/login" replace />
  if (state === 'needs-enroll') return <Navigate to="/admin/enroll" replace />
  if (state === 'needs-verify') return <Navigate to="/admin/verify" replace />
  return <>{children}</>
}
