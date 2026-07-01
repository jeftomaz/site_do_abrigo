import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  emptyEventFormValues,
  eventFormValuesToPayload,
  eventToFormValues,
  validateEventDateRange,
  type EventFormValues,
} from '../form'
import { useUpdateEvent } from '../hooks'
import type { Event } from '../types'
import { Button } from '../../../shared/ui/Button'
import Modal from '../../../shared/ui/Modal'
import { EventFormFields } from './EventFormFields'

interface EventEditModalProps {
  event: Event | null
  onClose: () => void
}

export function EventEditModal({ event, onClose }: EventEditModalProps) {
  const updateEvent = useUpdateEvent()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: emptyEventFormValues(),
  })

  useEffect(() => {
    reset(event ? eventToFormValues(event) : emptyEventFormValues())
    updateEvent.reset()
  }, [event, reset])

  const handleClose = () => {
    if (updateEvent.isPending) return
    onClose()
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!event) return
    const dateRangeValidation = validateEventDateRange(values)

    if (dateRangeValidation !== true) {
      setError('ends_at', { message: dateRangeValidation })
      return
    }

    try {
      await updateEvent.mutateAsync({
        id: event.id,
        input: eventFormValuesToPayload(values, event.rules),
      })
      onClose()
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <Modal
      open={event !== null}
      onClose={handleClose}
      title="Editar evento"
    >
      <form onSubmit={onSubmit}>
        <EventFormFields
          register={register}
          errors={errors}
          idPrefix="event-edit"
        />

        {updateEvent.isError && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Não foi possível salvar as alterações. Verifique sua sessão e se já existe outro evento ativo.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={updateEvent.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={updateEvent.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  )
}
