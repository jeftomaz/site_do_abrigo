import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { emptyStoryFormValues, storyFormValuesToPayload, type StoryFormValues } from '../form'
import { useCreateStory } from '../hooks'
import { useAllDogs } from '../../dogs/hooks'
import { StoryFormFields } from './StoryFormFields'
import { Button } from '../../../shared/ui/Button'

export function StoryCreateForm() {
  const createStory = useCreateStory()
  const { data: dogs = [] } = useAllDogs()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoryFormValues>({
    defaultValues: emptyStoryFormValues(),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null)

    try {
      const story = await createStory.mutateAsync(storyFormValuesToPayload(values))
      reset(emptyStoryFormValues())
      setSuccessMessage(`"${story.title}" foi cadastrada.`)
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Cadastrar história
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fotos serão adicionadas após o cadastro.
        </p>
      </div>

      <StoryFormFields register={register} errors={errors} idPrefix="story-create" dogs={dogs} />

      {createStory.isError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Não foi possível cadastrar a história. Verifique sua sessão e tente novamente.
        </p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-green-700 dark:text-green-300">{successMessage}</p>
      )}

      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={createStory.isPending}>
          Cadastrar
        </Button>
      </div>
    </form>
  )
}
