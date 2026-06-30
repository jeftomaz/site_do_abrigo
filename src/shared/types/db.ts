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
      events: {
        Row: {
          id: string
          type: Database['public']['Enums']['event_type']
          title: string
          description: string | null
          starts_at: string | null
          ends_at: string | null
          is_active: boolean
          rules: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: Database['public']['Enums']['event_type']
          title: string
          description?: string | null
          starts_at?: string | null
          ends_at?: string | null
          is_active?: boolean
          rules?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: Database['public']['Enums']['event_type']
          title?: string
          description?: string | null
          starts_at?: string | null
          ends_at?: string | null
          is_active?: boolean
          rules?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string | null
          price_cents: number
          image_path: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description?: string | null
          price_cents: number
          image_path?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string | null
          price_cents?: number
          image_path?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
        ]
      }
      raffle_numbers: {
        Row: {
          id: string
          event_id: string
          number: number
          label: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          number: number
          label?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          number?: number
          label?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'raffle_numbers_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
        ]
      }
      reservations: {
        Row: {
          id: string
          event_id: string
          product_id: string | null
          raffle_number_id: string | null
          customer_name: string
          contact: string
          status: Database['public']['Enums']['reservation_status']
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          product_id?: string | null
          raffle_number_id?: string | null
          customer_name: string
          contact: string
          status?: Database['public']['Enums']['reservation_status']
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          product_id?: string | null
          raffle_number_id?: string | null
          customer_name?: string
          contact?: string
          status?: Database['public']['Enums']['reservation_status']
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reservations_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
        ]
      }
      stories: {
        Row: {
          id: string
          dog_id: string | null
          title: string
          body: string
          photos: string[] | null
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dog_id?: string | null
          title: string
          body: string
          photos?: string[] | null
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dog_id?: string | null
          title?: string
          body?: string
          photos?: string[] | null
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'stories_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<never, never>
    Functions: {
      list_available_products: {
        Args: {
          p_event_id: string
        }
        Returns: Database['public']['Tables']['products']['Row'][]
      }
      list_available_raffle_numbers: {
        Args: {
          p_event_id: string
        }
        Returns: Database['public']['Tables']['raffle_numbers']['Row'][]
      }
    }
    Enums: {
      dog_status: 'available' | 'adopted' | 'deceased'
      event_type: 'product' | 'raffle'
      reservation_status: 'pending' | 'paid' | 'cancelled'
    }
    CompositeTypes: Record<never, never>
  }
}
