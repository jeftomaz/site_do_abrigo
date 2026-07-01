import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEvent,
  createProduct,
  createRaffleNumber,
  createReservation,
  getActiveEvent,
  listAllEvents,
  listAvailableProducts,
  listAvailableRaffleNumbers,
  listPastEvents,
  listProducts,
  listRaffleNumbers,
  listReservations,
  updateEvent,
  updateProduct,
  updateRaffleNumber,
  updateReservation,
} from './api'
import type { Event } from './types'

export const eventsQueryKeys = {
  all: ['events'] as const,
  list: () => [...eventsQueryKeys.all, 'list'] as const,
  active: () => [...eventsQueryKeys.all, 'active'] as const,
  past: () => [...eventsQueryKeys.all, 'past'] as const,
  products: (eventId: Event['id']) =>
    [...eventsQueryKeys.all, 'products', eventId] as const,
  raffleNumbers: (eventId: Event['id']) =>
    [...eventsQueryKeys.all, 'raffleNumbers', eventId] as const,
  reservations: (eventId: Event['id']) =>
    [...eventsQueryKeys.all, 'reservations', eventId] as const,
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

export function useProducts(eventId: Event['id'], enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.products(eventId),
    queryFn: () => listProducts(eventId),
    enabled: Boolean(eventId) && enabled,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: async (product) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.products(product.event_id),
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.availableProducts(product.event_id),
        }),
      ])
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: async (product) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.products(product.event_id),
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.availableProducts(product.event_id),
        }),
      ])
    },
  })
}

export function useRaffleNumbers(eventId: Event['id'], enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.raffleNumbers(eventId),
    queryFn: () => listRaffleNumbers(eventId),
    enabled: Boolean(eventId) && enabled,
  })
}

export function useCreateRaffleNumber() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRaffleNumber,
    onSuccess: async (raffleNumber) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.raffleNumbers(raffleNumber.event_id),
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.availableRaffleNumbers(raffleNumber.event_id),
        }),
      ])
    },
  })
}

export function useUpdateRaffleNumber() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRaffleNumber,
    onSuccess: async (raffleNumber) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.raffleNumbers(raffleNumber.event_id),
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.availableRaffleNumbers(raffleNumber.event_id),
        }),
      ])
    },
  })
}

export function useReservations(eventId: Event['id'], enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.reservations(eventId),
    queryFn: () => listReservations(eventId),
    enabled: Boolean(eventId) && enabled,
  })
}

export function useUpdateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateReservation,
    onSuccess: async (reservation) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.reservations(reservation.event_id),
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.availableProducts(reservation.event_id),
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueryKeys.availableRaffleNumbers(reservation.event_id),
        }),
      ])
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
