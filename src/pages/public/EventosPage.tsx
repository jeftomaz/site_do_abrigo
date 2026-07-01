import Header from '../../shared/ui/Header'
import { SkeletonCard } from '../../shared/ui/Skeleton'
import { StateMessage } from '../../shared/ui/StateMessage'
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
              <StateMessage variant="error">
                Não foi possível carregar o evento ativo. Tente novamente mais tarde.
              </StateMessage>
            )}

            {!isActiveLoading && !isActiveError && !activeEvent && (
              <StateMessage>
                Nenhum evento ativo no momento.
              </StateMessage>
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
              <StateMessage variant="error">
                Não foi possível carregar os eventos anteriores. Tente novamente mais tarde.
              </StateMessage>
            )}

            {!isPastLoading && !isPastError && pastEvents?.length === 0 && (
              <StateMessage>
                Nenhum evento anterior publicado ainda.
              </StateMessage>
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
