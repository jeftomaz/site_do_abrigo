import Header from '../../shared/ui/Header'
import { SkeletonCard } from '../../shared/ui/Skeleton'
import { useAvailableDogs } from '../../features/dogs/hooks'
import { DogCard } from '../../features/dogs/components/DogCard'

export default function AdocaoPage() {
  const { data: dogs, isLoading, isError } = useAvailableDogs()

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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
