import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  emptyRaffleNumberFormValues,
  raffleNumberFormValuesToPayload,
  type RaffleNumberFormValues,
} from '../itemForms'
import { useCreateRaffleNumber } from '../hooks'
import type { Event } from '../types'
import { Button } from '../../../shared/ui/Button'
import { RaffleNumberFormFields } from './RaffleNumberFormFields'

interface RaffleNumberCreateFormProps {
  event: Event
}

export function RaffleNumberCreateForm({ event }: RaffleNumberCreateFormProps) {
  const createRaffleNumber = useCreateRaffleNumber()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RaffleNumberFormValues>({
    defaultValues: emptyRaffleNumberFormValues(),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null)

    try {
      const raffleNumber = await createRaffleNumber.mutateAsync(
        raffleNumberFormValuesToPayload(values, event.id),
      )
      reset(emptyRaffleNumberFormValues())
      setSuccessMessage(`Número ${raffleNumber.number} foi cadastrado.`)
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        Cadastrar número
      </h3>

      <RaffleNumberFormFields
        register={register}
        errors={errors}
        idPrefix="raffle-number-create"
      />

      {createRaffleNumber.isError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Não foi possível cadastrar o número. Verifique se ele já existe neste evento.
        </p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-green-700 dark:text-green-300">
          {successMessage}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={createRaffleNumber.isPending} className="w-full sm:w-auto">
          Cadastrar número
        </Button>
      </div>
    </form>
  )
}
