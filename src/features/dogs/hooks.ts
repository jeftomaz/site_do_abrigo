import { useQuery } from '@tanstack/react-query'
import { listAvailableDogs, listAllDogs } from './api'

export const dogsQueryKeys = {
  all: ['dogs'] as const,
  available: () => [...dogsQueryKeys.all, 'available'] as const,
  list: () => [...dogsQueryKeys.all, 'list'] as const,
}

export function useAvailableDogs() {
  return useQuery({
    queryKey: dogsQueryKeys.available(),
    queryFn: listAvailableDogs,
  })
}

export function useAllDogs() {
  return useQuery({
    queryKey: dogsQueryKeys.list(),
    queryFn: listAllDogs,
  })
}
