import { supabase } from '../../shared/lib/supabase'
import { STORIES_BUCKET } from './constants'

export function storyPhotoUrl(path: string): string {
  return supabase.storage.from(STORIES_BUCKET).getPublicUrl(path).data.publicUrl
}

export function storyCoverUrl(photos: string[] | null): string | null {
  const first = photos?.[0]
  return first ? storyPhotoUrl(first) : null
}
