import { supabase } from '../../shared/lib/supabase'
import { DOGS_BUCKET } from './constants'

/** Resolve um path do Storage (bucket `dogs`) para URL pública. */
export function dogPhotoUrl(path: string): string {
  return supabase.storage.from(DOGS_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Primeira foto do cão como URL pública, ou null se não houver. */
export function dogCoverUrl(photos: string[] | null): string | null {
  const first = photos?.[0]
  return first ? dogPhotoUrl(first) : null
}

/** Rótulo de idade a partir do ano de nascimento (ex.: "3 anos"). */
export function dogAgeLabel(birthYear: number | null): string | null {
  if (birthYear == null) return null

  const age = new Date().getFullYear() - birthYear
  if (age < 0) return null
  if (age === 0) return 'menos de 1 ano'
  return age === 1 ? '1 ano' : `${age} anos`
}
