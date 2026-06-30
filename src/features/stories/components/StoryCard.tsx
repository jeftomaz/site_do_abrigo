import type { Story } from '../types'
import { storyCoverUrl } from '../format'

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  const cover = storyCoverUrl(story.photos)
  const date = new Date(story.published_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {cover && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={cover}
            alt={`Foto da história: ${story.title}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {date}
        </p>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{story.title}</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300">
          {story.body}
        </p>
      </div>
    </article>
  )
}
