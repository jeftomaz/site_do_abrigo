import { supabase } from '../../shared/lib/supabase'
import type { Dog } from './types'

const dogColumns =
  'id,name,size,birth_year,description,photos,status,created_at,updated_at' as const

export async function listAvailableDogs(): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select(dogColumns)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function listAllDogs(): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select(dogColumns)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
