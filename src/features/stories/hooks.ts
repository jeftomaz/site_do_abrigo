import { useQuery } from '@tanstack/react-query'
import { listStories } from './api'

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
