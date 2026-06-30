import { Link } from 'react-router-dom'
import { useAllDogs } from '../../../features/dogs/hooks'
import { dogAgeLabel } from '../../../features/dogs/format'
import type { DogStatus } from '../../../features/dogs/types'
import { Skeleton } from '../../../shared/ui/Skeleton'

const STATUS_LABEL: Record<DogStatus, string> = {
  available: 'Disponível',
  adopted: 'Adotado',
  deceased: 'Falecido',
}

const STATUS_CLASSES: Record<DogStatus, string> = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  adopted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  deceased: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

function StatusBadge({ status }: { status: DogStatus }) {
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

export default function AdminDogsPage() {
  const { data: dogs, isLoading, isError } = useAllDogs()

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Painel admin
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Cães</h1>
        </div>
      </div>

      {isError && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Não foi possível carregar os cães. Tente novamente mais tarde.
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && !isError && dogs && dogs.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Nenhum cão cadastrado ainda.
        </p>
      )}

      {!isLoading && !isError && dogs && dogs.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Porte</th>
                <th className="px-4 py-3 font-medium">Idade</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {dogs.map((dog) => (
                <tr
                  key={dog.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {dog.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {dog.size ?? <span className="text-gray-400 dark:text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {dogAgeLabel(dog.birth_year) ?? (
                      <span className="text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={dog.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-500">
                    {new Date(dog.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
