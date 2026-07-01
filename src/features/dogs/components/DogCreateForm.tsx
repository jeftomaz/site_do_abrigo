import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { dogFormValuesToPayload, emptyDogFormValues, type DogFormValues } from '../form'
import { useCreateDog } from '../hooks'
import { DogFormFields } from './DogFormFields'
import { Button } from '../../../shared/ui/Button'

export function DogCreateForm() {
  const createDog = useCreateDog()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DogFormValues>({
    defaultValues: emptyDogFormValues(),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null)

    try {
      const dog = await createDog.mutateAsync({
        ...dogFormValuesToPayload(values),
        status: 'available',
      })

      reset()
      setSuccessMessage(`${dog.name} foi cadastrado.`)
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
          Cadastrar cão
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          O cadastro entra como disponível. Fotos serão adicionadas em uma próxima etapa.
        </p>
      </div>

      <DogFormFields register={register} errors={errors} idPrefix="dog-create" />

      {createDog.isError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Não foi possível cadastrar o cão. Verifique sua sessão e tente novamente.
        </p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-green-700 dark:text-green-300">{successMessage}</p>
      )}

      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={createDog.isPending} className="w-full sm:w-auto">
          Cadastrar
        </Button>
      </div>
    </form>
  )
}
