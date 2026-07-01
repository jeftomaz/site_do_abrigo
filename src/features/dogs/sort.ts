import { DOG_SIZE_ORDER } from './constants'
import type { Dog } from './types'

export type SortKey = 'name' | 'age_desc' | 'age_asc' | 'size'

export function sortDogs(dogs: Dog[], key: SortKey): Dog[] {
  return [...dogs].sort((a, b) => {
    switch (key) {
      case 'name':
        return a.name.localeCompare(b.name, 'pt-BR')
      case 'age_desc': {
        if (a.birth_year == null && b.birth_year == null) return 0
        if (a.birth_year == null) return 1
        if (b.birth_year == null) return -1
        return b.birth_year - a.birth_year
      }
      case 'age_asc': {
        if (a.birth_year == null && b.birth_year == null) return 0
        if (a.birth_year == null) return 1
        if (b.birth_year == null) return -1
        return a.birth_year - b.birth_year
      }
      case 'size': {
        const aOrd = DOG_SIZE_ORDER[a.size?.toLowerCase() ?? ''] ?? 99
        const bOrd = DOG_SIZE_ORDER[b.size?.toLowerCase() ?? ''] ?? 99
        return aOrd - bOrd
      }
    }
  })
}
