import type { Event } from '../types'

interface EventCardProps {
  event: Event
  status: 'active' | 'past'
}

const eventTypeLabels: Record<Event['type'], string> = {
  product: 'Produtos',
  raffle: 'Rifa',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatEventPeriod(event: Event) {
  if (event.starts_at && event.ends_at) {
    return `${formatDate(event.starts_at)} a ${formatDate(event.ends_at)}`
  }

  if (event.starts_at) return `Desde ${formatDate(event.starts_at)}`
  if (event.ends_at) return `Até ${formatDate(event.ends_at)}`

  return 'Data não definida'
}

export function EventCard({ event, status }: EventCardProps) {
  const statusLabel = status === 'active' ? 'Evento ativo' : 'Encerrado'

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          {statusLabel}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {eventTypeLabels[event.type]}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        {event.title}
      </h3>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {formatEventPeriod(event)}
      </p>

      {event.description && (
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300">
          {event.description}
        </p>
      )}
    </article>
  )
}
