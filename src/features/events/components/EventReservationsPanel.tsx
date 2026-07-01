import { useMemo } from 'react'
import { Button } from '../../../shared/ui/Button'
import { SkeletonRows } from '../../../shared/ui/Skeleton'
import { StateMessage } from '../../../shared/ui/StateMessage'
import {
  formatReservationDeadline,
  productLabel,
  raffleNumberLabel,
  reservationExpiresInHours,
} from '../format'
import {
  useProducts,
  useRaffleNumbers,
  useReservations,
  useUpdateReservation,
} from '../hooks'
import type {
  Event,
  Product,
  RaffleNumber,
  Reservation,
  ReservationStatus,
} from '../types'

interface EventReservationsPanelProps {
  event: Event
}

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado',
}

const STATUS_CLASSES: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

export function EventReservationsPanel({ event }: EventReservationsPanelProps) {
  const reservations = useReservations(event.id)
  const products = useProducts(event.id, event.type === 'product')
  const raffleNumbers = useRaffleNumbers(event.id, event.type === 'raffle')
  const productMap = useMemo(
    () => new Map((products.data ?? []).map((product) => [product.id, product])),
    [products.data],
  )
  const raffleNumberMap = useMemo(
    () =>
      new Map(
        (raffleNumbers.data ?? []).map((raffleNumber) => [
          raffleNumber.id,
          raffleNumber,
        ]),
      ),
    [raffleNumbers.data],
  )

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Reservas
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Evento: {event.title}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Prazo padrão: {reservationExpiresInHours(event)}h
        </p>
      </div>

      {reservations.isLoading && <SkeletonRows rows={4} />}

      {reservations.isError && (
        <StateMessage variant="error">
          Não foi possível carregar as reservas.
        </StateMessage>
      )}

      {!reservations.isLoading &&
        !reservations.isError &&
        reservations.data?.length === 0 && (
          <StateMessage>
            Nenhuma reserva cadastrada neste evento.
          </StateMessage>
        )}

      {!reservations.isLoading &&
        !reservations.isError &&
        reservations.data &&
        reservations.data.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium">Reserva</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Prazo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                {reservations.data.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {reservation.customer_name}
                      </p>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {reservation.contact}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {reservationItemLabel({
                        reservation,
                        products: productMap,
                        raffleNumbers: raffleNumberMap,
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatReservationDeadline(reservation.expires_at)}
                    </td>
                    <td className="px-4 py-3">
                      <ReservationStatusControl reservation={reservation} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </section>
  )
}

function ReservationStatusControl({
  reservation,
}: {
  reservation: Reservation
}) {
  const updateReservation = useUpdateReservation()

  const handleStatusChange = async (status: ReservationStatus) => {
    try {
      await updateReservation.mutateAsync({
        id: reservation.id,
        input: { status },
      })
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  }

  return (
    <div className="flex min-w-40 flex-col gap-2">
      <span
        className={[
          'inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium',
          STATUS_CLASSES[reservation.status],
        ].join(' ')}
      >
        {STATUS_LABEL[reservation.status]}
      </span>
      <div className="flex gap-2">
        <select
          aria-label={`Status da reserva de ${reservation.customer_name}`}
          value={reservation.status}
          onChange={(event) =>
            handleStatusChange(event.target.value as ReservationStatus)
          }
          disabled={updateReservation.isPending}
          className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-white"
        >
          {(Object.keys(STATUS_LABEL) as ReservationStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleStatusChange('paid')}
          disabled={updateReservation.isPending || reservation.status === 'paid'}
        >
          Pago
        </Button>
      </div>
      {updateReservation.isError && (
        <span className="text-xs text-red-600 dark:text-red-400">
          Falha ao salvar.
        </span>
      )}
    </div>
  )
}

function reservationItemLabel({
  reservation,
  products,
  raffleNumbers,
}: {
  reservation: Reservation
  products: Map<Product['id'], Product>
  raffleNumbers: Map<RaffleNumber['id'], RaffleNumber>
}) {
  if (reservation.product_id) {
    const product = products.get(reservation.product_id)
    return product ? productLabel(product) : 'Produto'
  }

  if (reservation.raffle_number_id) {
    const raffleNumber = raffleNumbers.get(reservation.raffle_number_id)
    return raffleNumber ? raffleNumberLabel(raffleNumber) : 'Número de rifa'
  }

  return 'Item não identificado'
}
