import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../shared/lib/supabase'

function getInviteParams() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  return params.get('type') === 'invite' ? params : null
}

function clearAuthHash() {
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${window.location.search}`,
  )
}

export default function InviteHandler() {
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    const params = getInviteParams()
    if (!params) return

    let unsubscribe: (() => void) | null = null

    function goToSetPassword() {
      handled.current = true
      clearAuthHash()
      navigate('/admin/definir-senha', { replace: true })
    }

    async function handle() {
      if (handled.current) return

      const inviteError = params?.get('error') ?? params?.get('error_description')
      if (inviteError) {
        clearAuthHash()
        navigate('/admin/login', { replace: true })
        return
      }

      const accessToken = params?.get('access_token')
      const refreshToken = params?.get('refresh_token')

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          clearAuthHash()
          navigate('/admin/login', { replace: true })
          return
        }

        goToSetPassword()
        return
      }

      const { data } = await supabase.auth.getSession()
      if (data.session) {
        goToSetPassword()
        return
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' && !handled.current) {
          goToSetPassword()
        }
      })
      unsubscribe = subscription.unsubscribe
    }

    handle()
    return () => unsubscribe?.()
  }, [navigate])

  return null
}
