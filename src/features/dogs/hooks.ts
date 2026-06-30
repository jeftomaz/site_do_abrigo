import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDog, listAvailableDogs, listAllDogs, updateDog, uploadDogPhoto } from './api'

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

export function useCreateDog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDog,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dogsQueryKeys.list() }),
        queryClient.invalidateQueries({ queryKey: dogsQueryKeys.available() }),
      ])
    },
  })
}

export function useUpdateDog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDog,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dogsQueryKeys.list() }),
        queryClient.invalidateQueries({ queryKey: dogsQueryKeys.available() }),
      ])
    },
  })
}

export function useUploadDogPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDogPhoto,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dogsQueryKeys.list() }),
        queryClient.invalidateQueries({ queryKey: dogsQueryKeys.available() }),
      ])
    },
  })
}
