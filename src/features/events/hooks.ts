import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEvent,
  createReservation,
  getActiveEvent,
  listAllEvents,
  listAvailableProducts,
  listAvailableRaffleNumbers,
  listPastEvents,
  updateEvent,
} from './api'
import type { Event } from './types'

export const eventsQueryKeys = {
  all: ['events'] as const,
  list: () => [...eventsQueryKeys.all, 'list'] as const,
  active: () => [...eventsQueryKeys.all, 'active'] as const,
  past: () => [...eventsQueryKeys.all, 'past'] as const,
  availableProducts: (eventId: Event['id']) =>
    [...eventsQueryKeys.all, 'availableProducts', eventId] as const,
  availableRaffleNumbers: (eventId: Event['id']) =>
    [...eventsQueryKeys.all, 'availableRaffleNumbers', eventId] as const,
}

export function useActiveEvent() {
  return useQuery({
    queryKey: eventsQueryKeys.active(),
    queryFn: getActiveEvent,
  })
}

export function usePastEvents() {
  return useQuery({
    queryKey: eventsQueryKeys.past(),
    queryFn: listPastEvents,
  })
}

export function useAllEvents() {
  return useQuery({
    queryKey: eventsQueryKeys.list(),
    queryFn: listAllEvents,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
    },
  })
}

export function useAvailableProducts(eventId: Event['id'], enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.availableProducts(eventId),
    queryFn: () => listAvailableProducts(eventId),
    enabled: Boolean(eventId) && enabled,
  })
}

export function useAvailableRaffleNumbers(eventId: Event['id'], enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.availableRaffleNumbers(eventId),
    queryFn: () => listAvailableRaffleNumbers(eventId),
    enabled: Boolean(eventId) && enabled,
  })
}

export function useCreateReservation(eventId: Event['id']) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: eventsQueryKeys.availableProducts(eventId),
      })
      void queryClient.invalidateQueries({
        queryKey: eventsQueryKeys.availableRaffleNumbers(eventId),
      })
    },
  })
}
