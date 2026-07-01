import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStories } from '../../../features/stories/hooks'
import type { Story } from '../../../features/stories/types'
import { StoryCreateForm } from '../../../features/stories/components/StoryCreateForm'
import { StoryEditModal } from '../../../features/stories/components/StoryEditModal'
import { Button } from '../../../shared/ui/Button'
import { SkeletonRows } from '../../../shared/ui/Skeleton'
import { StateMessage } from '../../../shared/ui/StateMessage'

export default function AdminStoriesPage() {
  const { data: stories, isLoading, isError } = useStories()
  const [editingStory, setEditingStory] = useState<Story | null>(null)

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-6 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Painel admin
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Histórias</h1>
        </div>
      </div>

      <StoryCreateForm />

      {isError && (
        <StateMessage variant="error">
          Não foi possível carregar as histórias. Tente novamente mais tarde.
        </StateMessage>
      )}

      {isLoading && <SkeletonRows />}

      {!isLoading && !isError && stories && stories.length === 0 && (
        <StateMessage>
          Nenhuma história cadastrada ainda.
        </StateMessage>
      )}

      {!isLoading && !isError && stories && stories.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-[560px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Publicada em</th>
                <th className="px-4 py-3 font-medium">Fotos</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {story.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(story.published_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {story.photos?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingStory(story)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StoryEditModal
        story={editingStory}
        onStoryChange={setEditingStory}
        onClose={() => setEditingStory(null)}
      />
    </main>
  )
}
