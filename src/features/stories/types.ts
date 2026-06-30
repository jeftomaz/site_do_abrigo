import type { Database } from '../../shared/types/db'

export type Story = Database['public']['Tables']['stories']['Row']
export type StoryInsert = Database['public']['Tables']['stories']['Insert']
export type StoryUpdate = Database['public']['Tables']['stories']['Update']
