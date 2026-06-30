import Modal from '../../../shared/ui/Modal'
import type { Dog } from '../types'
import { dogAgeLabel, dogCoverUrl } from '../format'

// RASCUNHO — cores/estilo placeholder até tokens de design chegarem (ver DESIGN_SYSTEM.md)

const adoptionFormUrl = import.meta.env.VITE_ADOPTION_FORM_URL as string | undefined

interface DogDetailsModalProps {
  dog: Dog | null
  onClose: () => void
}

export function DogDetailsModal({ dog, onClose }: DogDetailsModalProps) {
  const cover = dog ? dogCoverUrl(dog.photos) : null
  const age = dog ? dogAgeLabel(dog.birth_year) : null
  const meta = dog ? [dog.size, age].filter(Boolean).join(' · ') : ''

  return (
    <Modal
      open={Boolean(dog)}
      onClose={onClose}
      title={dog?.name}
      footer={
        adoptionFormUrl ? (
          <a
            href={adoptionFormUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400 sm:w-auto"
          >
            Quero adotar
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-50 sm:w-auto"
          >
            Formulário indisponível
          </button>
        )
      }
    >
      {dog && (
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            {cover ? (
              <img
                src={cover}
                alt={`Foto de ${dog.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-full w-full items-center justify-center text-5xl text-gray-300 dark:text-gray-600"
              >
                🐾
              </div>
            )}
          </div>

          {meta && <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{meta}</p>}

          <p className="whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300">
            {dog.description || 'Descrição em breve.'}
          </p>
        </div>
      )}
    </Modal>
  )
}
