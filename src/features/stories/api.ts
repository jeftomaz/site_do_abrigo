import { supabase } from '../../shared/lib/supabase'
import type { Story } from './types'

const storyColumns =
  'id,dog_id,title,body,photos,published_at,created_at,updated_at' as const

export async function listStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select(storyColumns)
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
