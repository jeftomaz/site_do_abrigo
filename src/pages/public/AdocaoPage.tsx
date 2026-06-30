import { useState } from 'react'
import Header from '../../shared/ui/Header'
import { SkeletonCard } from '../../shared/ui/Skeleton'
import { useAvailableDogs } from '../../features/dogs/hooks'
import { DogCard } from '../../features/dogs/components/DogCard'
import { DogDetailsModal } from '../../features/dogs/components/DogDetailsModal'
import { DOG_SIZE_ORDER } from '../../features/dogs/constants'
import type { Dog } from '../../features/dogs/types'

type SortKey = 'name' | 'age_desc' | 'age_asc' | 'size'

function sortDogs(dogs: Dog[], key: SortKey): Dog[] {
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

export default function AdocaoPage() {
  const { data: dogs, isLoading, isError } = useAvailableDogs()
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('name')

  const sortedDogs = dogs ? sortDogs(dogs, sortKey) : []

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Adoção</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Conheça os cães que estão à espera de um novo lar.
        </p>

        <div className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Não foi possível carregar os cães. Tente novamente mais tarde.
            </p>
          )}

          {!isLoading && !isError && dogs && dogs.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Nenhum cão disponível para adoção no momento.
            </p>
          )}

          {!isLoading && !isError && dogs && dogs.length > 0 && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dogs.length} {dogs.length === 1 ? 'cão disponível' : 'cães disponíveis'}
                </p>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort-select"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Ordenar por
                  </label>
                  <select
                    id="sort-select"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="name">Nome (A–Z)</option>
                    <option value="age_desc">Mais novo</option>
                    <option value="age_asc">Mais velho</option>
                    <option value="size">Porte</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedDogs.map((dog) => (
                  <DogCard key={dog.id} dog={dog} onClick={setSelectedDog} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <DogDetailsModal dog={selectedDog} onClose={() => setSelectedDog(null)} />
    </>
  )
}
