import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createStory, listStories, updateStory, uploadStoryPhoto } from './api'

export const storiesQueryKeys = {
  all: ['stories'] as const,
  list: () => [...storiesQueryKeys.all, 'list'] as const,
}

export function useStories() {
  return useQuery({
    queryKey: storiesQueryKeys.list(),
    queryFn: listStories,
  })
}

export function useCreateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: storiesQueryKeys.list() })
    },
  })
}

export function useUpdateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: storiesQueryKeys.list() })
    },
  })
}

export function useUploadStoryPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadStoryPhoto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: storiesQueryKeys.list() })
    },
  })
}
