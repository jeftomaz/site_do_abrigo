import { supabase } from '../../shared/lib/supabase'
import type { Event, Product, RaffleNumber } from './types'

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
