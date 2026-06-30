import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  storyFormValuesToPayload,
  storyToFormValues,
  emptyStoryFormValues,
  type StoryFormValues,
} from '../form'
import { useUpdateStory } from '../hooks'
import { useAllDogs } from '../../dogs/hooks'
import type { Story } from '../types'
import { Button } from '../../../shared/ui/Button'
import Modal from '../../../shared/ui/Modal'
import { StoryFormFields } from './StoryFormFields'
import { StoryPhotoUpload } from './StoryPhotoUpload'

interface StoryEditModalProps {
  story: Story | null
  onStoryChange: (story: Story) => void
  onClose: () => void
}

export function StoryEditModal({ story, onStoryChange, onClose }: StoryEditModalProps) {
  const updateStory = useUpdateStory()
  const { data: dogs = [] } = useAllDogs()
  const [isPhotoUploadPending, setIsPhotoUploadPending] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoryFormValues>({
    defaultValues: emptyStoryFormValues(),
  })

  useEffect(() => {
    reset(story ? storyToFormValues(story) : emptyStoryFormValues())
    updateStory.reset()
  }, [story, reset])

  const handleClose = () => {
    if (updateStory.isPending || isPhotoUploadPending) return
    onClose()
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!story) return

    try {
      await updateStory.mutateAsync({
        id: story.id,
        input: storyFormValuesToPayload(values),
      })
      onClose()
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <Modal
      open={story !== null}
      onClose={handleClose}
      title={story ? `Editar história` : 'Editar história'}
    >
      <form onSubmit={onSubmit}>
        <StoryFormFields register={register} errors={errors} idPrefix="story-edit" dogs={dogs} />

        {story && (
          <StoryPhotoUpload
            story={story}
            onStoryChange={onStoryChange}
            onPendingChange={setIsPhotoUploadPending}
          />
        )}

        {updateStory.isError && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Não foi possível salvar as alterações. Verifique sua sessão e tente novamente.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={updateStory.isPending || isPhotoUploadPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={updateStory.isPending}
            disabled={isPhotoUploadPending}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  )
}
