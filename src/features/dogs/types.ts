import type { Database } from '../../shared/types/db'

export type DogStatus = Database['public']['Enums']['dog_status']
export type Dog = Database['public']['Tables']['dogs']['Row']
export type DogInsert = Database['public']['Tables']['dogs']['Insert']
export type DogUpdate = Database['public']['Tables']['dogs']['Update']
