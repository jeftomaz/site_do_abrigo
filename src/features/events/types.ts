import type { Database } from '../../shared/types/db'

export type Event = Database['public']['Tables']['events']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type RaffleNumber = Database['public']['Tables']['raffle_numbers']['Row']
export type Reservation = Database['public']['Tables']['reservations']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type RaffleNumberInsert =
  Database['public']['Tables']['raffle_numbers']['Insert']
export type ReservationInsert =
  Database['public']['Tables']['reservations']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type RaffleNumberUpdate =
  Database['public']['Tables']['raffle_numbers']['Update']
export type ReservationUpdate =
  Database['public']['Tables']['reservations']['Update']
export type EventType = Database['public']['Enums']['event_type']
export type ReservationStatus =
  Database['public']['Enums']['reservation_status']
