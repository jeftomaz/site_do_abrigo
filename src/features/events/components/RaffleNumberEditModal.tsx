import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  emptyRaffleNumberFormValues,
  raffleNumberFormValuesToPayload,
  raffleNumberToFormValues,
  type RaffleNumberFormValues,
} from '../itemForms'
import { useUpdateRaffleNumber } from '../hooks'
import type { RaffleNumber } from '../types'
import { Button } from '../../../shared/ui/Button'
import Modal from '../../../shared/ui/Modal'
import { RaffleNumberFormFields } from './RaffleNumberFormFields'

interface RaffleNumberEditModalProps {
  raffleNumber: RaffleNumber | null
  onClose: () => void
}

export function RaffleNumberEditModal({
  raffleNumber,
  onClose,
}: RaffleNumberEditModalProps) {
  const updateRaffleNumber = useUpdateRaffleNumber()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RaffleNumberFormValues>({
    defaultValues: emptyRaffleNumberFormValues(),
  })

  useEffect(() => {
    reset(
      raffleNumber
        ? raffleNumberToFormValues(raffleNumber)
        : emptyRaffleNumberFormValues(),
    )
    updateRaffleNumber.reset()
  }, [raffleNumber, reset])

  const handleClose = () => {
    if (updateRaffleNumber.isPending) return
    onClose()
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!raffleNumber) return

    try {
      await updateRaffleNumber.mutateAsync({
        id: raffleNumber.id,
        input: raffleNumberFormValuesToPayload(values, raffleNumber.event_id),
      })
      onClose()
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <Modal
      open={raffleNumber !== null}
      onClose={handleClose}
      title="Editar número"
    >
      <form onSubmit={onSubmit}>
        <RaffleNumberFormFields
          register={register}
          errors={errors}
          idPrefix="raffle-number-edit"
        />

        {updateRaffleNumber.isError && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Não foi possível salvar as alterações. Verifique sua sessão e tente novamente.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={updateRaffleNumber.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={updateRaffleNumber.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  )
}
