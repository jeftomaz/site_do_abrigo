import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { dogPhotoUrl } from '../format'
import { useUploadDogPhoto } from '../hooks'
import type { Dog } from '../types'
import { Button } from '../../../shared/ui/Button'

interface DogPhotoUploadProps {
  dog: Dog
  onDogChange: (dog: Dog) => void
  onPendingChange: (isPending: boolean) => void
}

export function DogPhotoUpload({ dog, onDogChange, onPendingChange }: DogPhotoUploadProps) {
  const uploadDogPhoto = useUploadDogPhoto()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const photos = dog.photos ?? []

  useEffect(() => {
    onPendingChange(uploadDogPhoto.isPending)
  }, [onPendingChange, uploadDogPhoto.isPending])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setValidationError(null)

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!nextFile.type.startsWith('image/')) {
      setFile(null)
      setValidationError('Selecione um arquivo de imagem.')
      return
    }

    setFile(nextFile)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      const updatedDog = await uploadDogPhoto.mutateAsync({ dog, file })
      onDogChange(updatedDog)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  }

  return (
    <section className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Fotos</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          A primeira foto aparece como capa na página pública.
        </p>
      </div>

      {photos.length > 0 ? (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo}
              className="overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
            >
              <img
                src={dogPhotoUrl(photo)}
                alt={`Foto ${index + 1} de ${dog.name}`}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 rounded-md border border-dashed border-gray-300 px-3 py-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Nenhuma foto enviada ainda.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploadDogPhoto.isPending}
          className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 dark:text-gray-300 dark:file:bg-gray-800 dark:file:text-gray-200 dark:hover:file:bg-gray-700"
        />
        <Button
          type="button"
          onClick={handleUpload}
          isLoading={uploadDogPhoto.isPending}
          disabled={!file}
          className="sm:shrink-0"
        >
          Enviar foto
        </Button>
      </div>

      {validationError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationError}</p>
      )}

      {uploadDogPhoto.isError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Não foi possível enviar a foto. Verifique sua sessão e tente novamente.
        </p>
      )}
    </section>
  )
}
