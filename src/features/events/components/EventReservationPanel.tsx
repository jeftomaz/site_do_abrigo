import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../shared/ui/Button'
import Field from '../../../shared/ui/Field'
import { SkeletonCard } from '../../../shared/ui/Skeleton'
import { StateMessage } from '../../../shared/ui/StateMessage'
import {
  formatPriceCents,
  formatReservationDeadline,
  PIX_KEY,
  productLabel,
  raffleNumberLabel,
  rafflePriceCents,
  reservationExpiresInHours,
} from '../format'
import {
  useAvailableProducts,
  useAvailableRaffleNumbers,
  useCreateReservation,
} from '../hooks'
import type { Event, Product, RaffleNumber } from '../types'

type ReservationTarget =
  | { type: 'product'; item: Product; label: string; priceCents: number }
  | {
      type: 'raffle'
      item: RaffleNumber
      label: string
      priceCents: number | null
    }

interface ReservationFormValues {
  customerName: string
  contact: string
}

interface ReservationSuccess {
  label: string
  priceCents: number | null
  expiresAt: string
}

interface EventReservationPanelProps {
  event: Event
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function EventReservationPanel({ event }: EventReservationPanelProps) {
  const [selectedTarget, setSelectedTarget] = useState<ReservationTarget | null>(
    null,
  )
  const [success, setSuccess] = useState<ReservationSuccess | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const reservationHours = reservationExpiresInHours(event)
  const createReservation = useCreateReservation(event.id)
  const products = useAvailableProducts(event.id, event.type === 'product')
  const raffleNumbers = useAvailableRaffleNumbers(
    event.id,
    event.type === 'raffle',
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    defaultValues: {
      customerName: '',
      contact: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedTarget) return

    setSuccess(null)

    try {
      const expiresAt = await createReservation.mutateAsync({
        eventId: event.id,
        productId:
          selectedTarget.type === 'product' ? selectedTarget.item.id : null,
        raffleNumberId:
          selectedTarget.type === 'raffle' ? selectedTarget.item.id : null,
        customerName: values.customerName.trim(),
        contact: values.contact.trim(),
      })

      setSuccess({
        label: selectedTarget.label,
        priceCents: selectedTarget.priceCents,
        expiresAt,
      })
      setSelectedTarget(null)
      reset()
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  async function copyPixKey() {
    await navigator.clipboard.writeText(PIX_KEY)
    setCopyMessage('Chave copiada.')
  }

  const isLoading =
    event.type === 'product' ? products.isLoading : raffleNumbers.isLoading
  const isError =
    event.type === 'product' ? products.isError : raffleNumbers.isError
  const availableProducts = products.data ?? []
  const availableRaffleNumbers = raffleNumbers.data ?? []
  const rafflePrice = rafflePriceCents(event)

  return (
    <section
      className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      aria-labelledby="reservation-panel-title"
    >
      <div>
        <h3
          id="reservation-panel-title"
          className="text-base font-semibold text-gray-900 dark:text-gray-100"
        >
          Reservar
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          A reserva fica aguardando comprovante por {reservationHours} horas.
        </p>
      </div>

      {isLoading && (
        <div className="mt-4">
          <SkeletonCard />
        </div>
      )}

      {isError && (
        <StateMessage className="mt-4" variant="error">
          Não foi possível carregar os itens disponíveis.
        </StateMessage>
      )}

      {!isLoading && !isError && event.type === 'product' && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {availableProducts.length === 0 && (
            <StateMessage className="sm:col-span-2">
              Nenhum produto disponível para reserva.
            </StateMessage>
          )}

          {availableProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                setSuccess(null)
                setSelectedTarget({
                  type: 'product',
                  item: product,
                  label: productLabel(product),
                  priceCents: product.price_cents,
                })
              }}
              className={classNames(
                'rounded-lg border p-4 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                selectedTarget?.type === 'product' &&
                  selectedTarget.item.id === product.id
                  ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
              )}
            >
              <span className="block font-medium text-gray-900 dark:text-gray-100">
                {product.name}
              </span>
              <span className="mt-1 block text-sm text-gray-600 dark:text-gray-300">
                {formatPriceCents(product.price_cents)}
              </span>
              {product.description && (
                <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
                  {product.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {!isLoading && !isError && event.type === 'raffle' && (
        <div className="mt-4">
          {availableRaffleNumbers.length === 0 && (
            <StateMessage>
              Nenhum número disponível para reserva.
            </StateMessage>
          )}

          {availableRaffleNumbers.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
              {availableRaffleNumbers.map((raffleNumber) => (
                <button
                  key={raffleNumber.id}
                  type="button"
                  onClick={() => {
                    setSuccess(null)
                    setSelectedTarget({
                      type: 'raffle',
                      item: raffleNumber,
                      label: raffleNumberLabel(raffleNumber),
                      priceCents: rafflePrice,
                    })
                  }}
                  className={classNames(
                    'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    selectedTarget?.type === 'raffle' &&
                      selectedTarget.item.id === raffleNumber.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-200'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
                  )}
                >
                  {raffleNumber.number}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        {selectedTarget && (
          <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
            Selecionado: {selectedTarget.label}
            {selectedTarget.priceCents !== null
              ? ` · ${formatPriceCents(selectedTarget.priceCents)}`
              : ''}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Nome"
            autoComplete="name"
            error={errors.customerName?.message}
            {...register('customerName', {
              required: 'Informe seu nome.',
              validate: (value) =>
                value.trim().length > 0 || 'Informe seu nome.',
            })}
          />
          <Field
            label="Contato"
            autoComplete="tel"
            hint="WhatsApp ou Instagram"
            error={errors.contact?.message}
            {...register('contact', {
              required: 'Informe um contato.',
              validate: (value) =>
                value.trim().length > 0 || 'Informe um contato.',
            })}
          />
        </div>

        {createReservation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Não foi possível criar a reserva. Confira se o item ainda está
            disponível e tente novamente.
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={createReservation.isPending}
            disabled={!selectedTarget}
          >
            Reservar
          </Button>
        </div>
      </form>

      {success && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-200">
          <p className="font-semibold">Reserva criada: {success.label}</p>
          <p className="mt-2">
            Faça o PIX para a chave {PIX_KEY}
            {success.priceCents !== null
              ? ` no valor de ${formatPriceCents(success.priceCents)}`
              : ''}
            .
          </p>
          <p className="mt-1">
            Envie o comprovante para o abrigo até{' '}
            {formatReservationDeadline(success.expiresAt)} para confirmar.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={copyPixKey}>
              Copiar chave PIX
            </Button>
            {copyMessage && <span>{copyMessage}</span>}
          </div>
        </div>
      )}
    </section>
  )
}
