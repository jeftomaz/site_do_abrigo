import { useQuery } from '@tanstack/react-query'
import { listAvailableDogs } from './api'

export const dogsQueryKeys = {
  all: ['dogs'] as const,
  available: () => [...dogsQueryKeys.all, 'available'] as const,
}

export function useAvailableDogs() {
  return useQuery({
    queryKey: dogsQueryKeys.available(),
    queryFn: listAvailableDogs,
  })
}
