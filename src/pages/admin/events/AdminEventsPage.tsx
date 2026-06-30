import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EventCreateForm } from '../../../features/events/components/EventCreateForm'
import { EventEditModal } from '../../../features/events/components/EventEditModal'
import { reservationExpiresInHours } from '../../../features/events/format'
import { useAllEvents } from '../../../features/events/hooks'
import type { Event } from '../../../features/events/types'
import { Button } from '../../../shared/ui/Button'
import { Skeleton } from '../../../shared/ui/Skeleton'

const EVENT_TYPE_LABEL: Record<Event['type'], string> = {
  product: 'Produtos',
  raffle: 'Rifa',
}

function eventStatus(event: Event): 'active' | 'past' | 'draft' {
  if (event.is_active) return 'active'
  if (event.ends_at && new Date(event.ends_at).getTime() <= Date.now()) return 'past'
  return 'draft'
}

const STATUS_LABEL: Record<ReturnType<typeof eventStatus>, string> = {
  active: 'Ativo',
  past: 'Encerrado',
  draft: 'Rascunho',
}

const STATUS_CLASSES: Record<ReturnType<typeof eventStatus>, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  past: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
}

function StatusBadge({ event }: { event: Event }) {
  const status = eventStatus(event)

  return (
    <span
      className={[
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_CLASSES[status],
      ].join(' ')}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function formatDate(value: string | null) {
  if (!value) return <span className="text-gray-400 dark:text-gray-600">—</span>

  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function AdminEventsPage() {
  const { data: events, isLoading, isError } = useAllEvents()
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Painel admin
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Eventos
          </h1>
        </div>
      </div>

      <EventCreateForm />

      {isError && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Não foi possível carregar os eventos. Tente novamente mais tarde.
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && !isError && events && events.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Nenhum evento cadastrado ainda.
        </p>
      )}

      {!isLoading && !isError && events && events.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Período</th>
                <th className="px-4 py-3 font-medium">Prazo</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {EVENT_TYPE_LABEL[event.type]}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge event={event} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {formatDate(event.starts_at)} a {formatDate(event.ends_at)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {reservationExpiresInHours(event)}h
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EventEditModal
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
      />
    </main>
  )
}
