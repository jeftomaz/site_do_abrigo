import { supabase } from '../../shared/lib/supabase'

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getAssuranceLevel = () =>
  supabase.auth.mfa.getAuthenticatorAssuranceLevel()

export const listFactors = () => supabase.auth.mfa.listFactors()

export const enrollTOTP = () => supabase.auth.mfa.enroll({ factorType: 'totp' })

export const challengeFactor = (factorId: string) =>
  supabase.auth.mfa.challenge({ factorId })

export const verifyFactor = (factorId: string, challengeId: string, code: string) =>
  supabase.auth.mfa.verify({ factorId, challengeId, code })
