import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/db'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

function shouldDetectSessionInUrl(_url: URL, params: Record<string, string>) {
  if (params.type === 'invite') return false

  return Boolean(
    params.access_token ||
      params.error ||
      params.error_description ||
      params.error_code,
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: shouldDetectSessionInUrl,
  },
})
