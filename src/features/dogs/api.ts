import { supabase } from '../../shared/lib/supabase'
import { DOGS_BUCKET } from './constants'
import type { Dog, DogInsert, DogUpdate } from './types'

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

export async function createDog(input: DogInsert): Promise<Dog> {
  const { data, error } = await supabase
    .from('dogs')
    .insert(input)
    .select(dogColumns)
    .single()

  if (error) throw error
  return data
}

export async function updateDog({
  id,
  input,
}: {
  id: Dog['id']
  input: DogUpdate
}): Promise<Dog> {
  const { data, error } = await supabase
    .from('dogs')
    .update(input)
    .eq('id', id)
    .select(dogColumns)
    .single()

  if (error) throw error
  return data
}

export async function uploadDogPhoto({
  dog,
  file,
}: {
  dog: Dog
  file: File
}): Promise<Dog> {
  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo precisa ser uma imagem.')
  }

  const path = `${dog.id}/${Date.now()}-${safeFileName(file.name)}`
  const { error: uploadError } = await supabase.storage
    .from(DOGS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) throw uploadError

  return updateDog({
    id: dog.id,
    input: {
      photos: [...(dog.photos ?? []), path],
    },
  })
}

function safeFileName(fileName: string): string {
  const fallback = 'foto.jpg'
  const normalized = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || fallback
}
