import Header from '../../shared/ui/Header'
import { SkeletonCard } from '../../shared/ui/Skeleton'
import { EventCard } from '../../features/events/components/EventCard'
import { EventReservationPanel } from '../../features/events/components/EventReservationPanel'
import { useActiveEvent, usePastEvents } from '../../features/events/hooks'

export default function EventosPage() {
  const {
    data: activeEvent,
    isLoading: isActiveLoading,
    isError: isActiveError,
  } = useActiveEvent()
  const {
    data: pastEvents,
    isLoading: isPastLoading,
    isError: isPastError,
  } = usePastEvents()

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Eventos
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
          Campanhas de arrecadação do abrigo, rifas e ações especiais.
        </p>

        <section className="mt-8" aria-labelledby="active-event-title">
          <h2
            id="active-event-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Evento ativo
          </h2>

          <div className="mt-4">
            {isActiveLoading && <SkeletonCard />}

            {isActiveError && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                Não foi possível carregar o evento ativo. Tente novamente mais tarde.
              </p>
            )}

            {!isActiveLoading && !isActiveError && !activeEvent && (
              <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                Nenhum evento ativo no momento.
              </p>
            )}

            {!isActiveLoading && !isActiveError && activeEvent && (
              <>
                <EventCard event={activeEvent} status="active" />
                <EventReservationPanel event={activeEvent} />
              </>
            )}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="past-events-title">
          <h2
            id="past-events-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Eventos anteriores
          </h2>

          <div className="mt-4">
            {isPastLoading && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {isPastError && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                Não foi possível carregar os eventos anteriores. Tente novamente mais tarde.
              </p>
            )}

            {!isPastLoading && !isPastError && pastEvents?.length === 0 && (
              <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                Nenhum evento anterior publicado ainda.
              </p>
            )}

            {!isPastLoading && !isPastError && pastEvents && pastEvents.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} status="past" />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
