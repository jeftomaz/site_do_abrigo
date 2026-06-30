import { supabase } from '../../shared/lib/supabase'
import type {
  Event,
  EventInsert,
  EventUpdate,
  Product,
  RaffleNumber,
} from './types'

const eventColumns =
  'id,title,description,type,is_active,starts_at,ends_at,rules,created_at,updated_at' as const

export async function getActiveEvent(): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select(eventColumns)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function listPastEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select(eventColumns)
    .eq('is_active', false)
    .not('ends_at', 'is', null)
    .lte('ends_at', new Date().toISOString())
    .order('ends_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function listAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select(eventColumns)
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createEvent(input: EventInsert): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert(input)
    .select(eventColumns)
    .single()

  if (error) throw error
  return data
}

export async function updateEvent({
  id,
  input,
}: {
  id: Event['id']
  input: EventUpdate
}): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(input)
    .eq('id', id)
    .select(eventColumns)
    .single()

  if (error) throw error
  return data
}

export async function listAvailableProducts(
  eventId: Event['id'],
): Promise<Product[]> {
  const { data, error } = await supabase.rpc('list_available_products', {
    p_event_id: eventId,
  })

  if (error) throw error
  return data ?? []
}

export async function listAvailableRaffleNumbers(
  eventId: Event['id'],
): Promise<RaffleNumber[]> {
  const { data, error } = await supabase.rpc(
    'list_available_raffle_numbers',
    {
      p_event_id: eventId,
    },
  )

  if (error) throw error
  return data ?? []
}

interface CreateReservationInput {
  eventId: Event['id']
  productId?: Product['id'] | null
  raffleNumberId?: RaffleNumber['id'] | null
  customerName: string
  contact: string
}

export async function createReservation({
  eventId,
  productId = null,
  raffleNumberId = null,
  customerName,
  contact,
}: CreateReservationInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_public_reservation', {
    p_event_id: eventId,
    p_product_id: productId,
    p_raffle_number_id: raffleNumberId,
    p_customer_name: customerName,
    p_contact: contact,
  })

  if (error) throw error
  return data
}
