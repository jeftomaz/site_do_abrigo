import { Card } from '../../../shared/ui/Card'
import type { Dog } from '../types'
import { dogAgeLabel, dogCoverUrl } from '../format'

// ⚠️ RASCUNHO — cores/estilo placeholder até tokens de design chegarem (ver DESIGN_SYSTEM.md)

interface DogCardProps {
  dog: Dog
  onClick?: (dog: Dog) => void
}

export function DogCard({ dog, onClick }: DogCardProps) {
  const cover = dogCoverUrl(dog.photos)
  const age = dogAgeLabel(dog.birth_year)
  const meta = [dog.size, age].filter(Boolean).join(' · ')

  const clickable = Boolean(onClick)

  return (
    <Card
      padding="none"
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick ? () => onClick(dog) : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(dog)
              }
            }
          : undefined
      }
      className={[
        'flex flex-col overflow-hidden',
        clickable
          ? 'cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          : '',
      ].join(' ')}
    >
      <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-gray-800">
        {cover ? (
          <img
            src={cover}
            alt={`Foto de ${dog.name}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center text-4xl text-gray-300 dark:text-gray-600"
          >
            🐾
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{dog.name}</h3>
        {meta && <p className="text-sm text-gray-500 dark:text-gray-400">{meta}</p>}
      </div>
    </Card>
  )
}
