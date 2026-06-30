import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  dogFormValuesToPayload,
  dogToFormValues,
  emptyDogFormValues,
  type DogFormValues,
} from '../form'
import { useUpdateDog } from '../hooks'
import type { Dog } from '../types'
import { Button } from '../../../shared/ui/Button'
import Modal from '../../../shared/ui/Modal'
import { DogFormFields } from './DogFormFields'
import { DogPhotoUpload } from './DogPhotoUpload'

interface DogEditModalProps {
  dog: Dog | null
  onDogChange: (dog: Dog) => void
  onClose: () => void
}

export function DogEditModal({ dog, onDogChange, onClose }: DogEditModalProps) {
  const updateDog = useUpdateDog()
  const [isPhotoUploadPending, setIsPhotoUploadPending] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DogFormValues>({
    defaultValues: emptyDogFormValues(),
  })

  useEffect(() => {
    reset(dog ? dogToFormValues(dog) : emptyDogFormValues())
    updateDog.reset()
  }, [dog, reset])

  const handleClose = () => {
    if (updateDog.isPending || isPhotoUploadPending) return
    onClose()
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!dog) return

    try {
      await updateDog.mutateAsync({
        id: dog.id,
        input: dogFormValuesToPayload(values),
      })
      onClose()
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <Modal
      open={dog !== null}
      onClose={handleClose}
      title={dog ? `Editar ${dog.name}` : 'Editar cão'}
    >
      <form onSubmit={onSubmit}>
        <DogFormFields register={register} errors={errors} idPrefix="dog-edit" />

        {dog && (
          <DogPhotoUpload
            dog={dog}
            onDogChange={onDogChange}
            onPendingChange={setIsPhotoUploadPending}
          />
        )}

        {updateDog.isError && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Não foi possível salvar as alterações. Verifique sua sessão e tente novamente.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={updateDog.isPending || isPhotoUploadPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={updateDog.isPending}
            disabled={isPhotoUploadPending}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  )
}
