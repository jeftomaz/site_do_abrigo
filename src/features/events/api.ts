import { supabase } from '../../shared/lib/supabase'
import type {
  Event,
  EventInsert,
  EventUpdate,
  Product,
  ProductInsert,
  ProductUpdate,
  RaffleNumber,
  RaffleNumberInsert,
  RaffleNumberUpdate,
  Reservation,
  ReservationUpdate,
} from './types'

const eventColumns =
  'id,title,description,type,is_active,starts_at,ends_at,rules,created_at,updated_at' as const
const productColumns =
  'id,event_id,name,description,price_cents,image_path,sort_order,created_at,updated_at' as const
const raffleNumberColumns =
  'id,event_id,number,label,sort_order,created_at,updated_at' as const
const reservationColumns =
  'id,event_id,product_id,raffle_number_id,customer_name,contact,status,expires_at,created_at,updated_at' as const

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

export async function listProducts(eventId: Event['id']): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productColumns)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createProduct(input: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(input)
    .select(productColumns)
    .single()

  if (error) throw error
  return data
}

export async function updateProduct({
  id,
  input,
}: {
  id: Product['id']
  input: ProductUpdate
}): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(input)
    .eq('id', id)
    .select(productColumns)
    .single()

  if (error) throw error
  return data
}

export async function listRaffleNumbers(
  eventId: Event['id'],
): Promise<RaffleNumber[]> {
  const { data, error } = await supabase
    .from('raffle_numbers')
    .select(raffleNumberColumns)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })
    .order('number', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createRaffleNumber(
  input: RaffleNumberInsert,
): Promise<RaffleNumber> {
  const { data, error } = await supabase
    .from('raffle_numbers')
    .insert(input)
    .select(raffleNumberColumns)
    .single()

  if (error) throw error
  return data
}

export async function updateRaffleNumber({
  id,
  input,
}: {
  id: RaffleNumber['id']
  input: RaffleNumberUpdate
}): Promise<RaffleNumber> {
  const { data, error } = await supabase
    .from('raffle_numbers')
    .update(input)
    .eq('id', id)
    .select(raffleNumberColumns)
    .single()

  if (error) throw error
  return data
}

export async function listReservations(
  eventId: Event['id'],
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select(reservationColumns)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function updateReservation({
  id,
  input,
}: {
  id: Reservation['id']
  input: ReservationUpdate
}): Promise<Reservation> {
  const { data, error } = await supabase
    .from('reservations')
    .update(input)
    .eq('id', id)
    .select(reservationColumns)
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
