import Header from '../../shared/ui/Header'
import { SkeletonCard } from '../../shared/ui/Skeleton'
import { useStories } from '../../features/stories/hooks'
import { StoryCard } from '../../features/stories/components/StoryCard'

export default function HistoriasPage() {
  const { data: stories, isLoading, isError } = useStories()

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Histórias de Adoção
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Cães que encontraram um novo lar e as famílias que os escolheram.
        </p>

        <div className="mt-8">
          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Não foi possível carregar as histórias. Tente novamente mais tarde.
            </p>
          )}

          {!isLoading && !isError && stories && stories.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Nenhuma história publicada ainda. Em breve!
            </p>
          )}

          {!isLoading && !isError && stories && stories.length > 0 && (
            <div className="space-y-8">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
