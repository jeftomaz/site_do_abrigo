export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dogs: {
        Row: {
          id: string
          name: string
          size: string | null
          birth_year: number | null
          description: string | null
          photos: string[] | null
          status: Database['public']['Enums']['dog_status']
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          size?: string | null
          birth_year?: number | null
          description?: string | null
          photos?: string[] | null
          status?: Database['public']['Enums']['dog_status']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          size?: string | null
          birth_year?: number | null
          description?: string | null
          photos?: string[] | null
          status?: Database['public']['Enums']['dog_status']
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: {
      dog_status: 'available' | 'adopted' | 'deceased'
    }
    CompositeTypes: Record<never, never>
  }
}
