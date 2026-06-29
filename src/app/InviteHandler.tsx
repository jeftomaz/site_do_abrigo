import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../shared/lib/supabase'

export default function InviteHandler() {
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    if (params.get('type') !== 'invite') return

    let unsubscribe: (() => void) | null = null

    async function handle() {
      if (handled.current) return

      const { data } = await supabase.auth.getSession()
      if (data.session) {
        handled.current = true
        navigate('/admin/definir-senha', { replace: true })
        return
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' && !handled.current) {
          handled.current = true
          navigate('/admin/definir-senha', { replace: true })
        }
      })
      unsubscribe = subscription.unsubscribe
    }

    handle()
    return () => unsubscribe?.()
  }, [navigate])

  return null
}
