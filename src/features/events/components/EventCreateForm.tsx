import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  emptyEventFormValues,
  eventFormValuesToPayload,
  validateEventDateRange,
  type EventFormValues,
} from '../form'
import { useCreateEvent } from '../hooks'
import { Button } from '../../../shared/ui/Button'
import { EventFormFields } from './EventFormFields'

export function EventCreateForm() {
  const createEvent = useCreateEvent()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: emptyEventFormValues(),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null)
    const dateRangeValidation = validateEventDateRange(values)

    if (dateRangeValidation !== true) {
      setError('ends_at', { message: dateRangeValidation })
      return
    }

    try {
      const event = await createEvent.mutateAsync(eventFormValuesToPayload(values))
      reset(emptyEventFormValues())
      setSuccessMessage(`"${event.title}" foi cadastrado.`)
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
          Cadastrar evento
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Produtos e números serão gerenciados no próximo passo.
        </p>
      </div>

      <EventFormFields
        register={register}
        errors={errors}
        idPrefix="event-create"
      />

      {createEvent.isError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Não foi possível cadastrar o evento. Verifique sua sessão e se já existe outro evento ativo.
        </p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-green-700 dark:text-green-300">
          {successMessage}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={createEvent.isPending}>
          Cadastrar
        </Button>
      </div>
    </form>
  )
}
