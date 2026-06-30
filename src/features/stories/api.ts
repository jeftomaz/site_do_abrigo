import { supabase } from '../../shared/lib/supabase'
import { STORIES_BUCKET } from './constants'
import type { Story, StoryInsert, StoryUpdate } from './types'

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

export async function createStory(input: StoryInsert): Promise<Story> {
  const { data, error } = await supabase
    .from('stories')
    .insert(input)
    .select(storyColumns)
    .single()

  if (error) throw error
  return data
}

export async function updateStory({
  id,
  input,
}: {
  id: Story['id']
  input: StoryUpdate
}): Promise<Story> {
  const { data, error } = await supabase
    .from('stories')
    .update(input)
    .eq('id', id)
    .select(storyColumns)
    .single()

  if (error) throw error
  return data
}

export async function uploadStoryPhoto({
  story,
  file,
}: {
  story: Story
  file: File
}): Promise<Story> {
  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo precisa ser uma imagem.')
  }

  const path = `${story.id}/${Date.now()}-${safeFileName(file.name)}`
  const { error: uploadError } = await supabase.storage
    .from(STORIES_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) throw uploadError

  return updateStory({
    id: story.id,
    input: {
      photos: [...(story.photos ?? []), path],
    },
  })
}

function safeFileName(fileName: string): string {
  const fallback = 'foto.jpg'
  const normalized = fileName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || fallback
}
