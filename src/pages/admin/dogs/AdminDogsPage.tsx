import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllDogs, useUpdateDog } from '../../../features/dogs/hooks'
import { dogAgeLabel } from '../../../features/dogs/format'
import { DogCreateForm } from '../../../features/dogs/components/DogCreateForm'
import { DogEditModal } from '../../../features/dogs/components/DogEditModal'
import type { Dog, DogStatus } from '../../../features/dogs/types'
import { Button } from '../../../shared/ui/Button'
import { SkeletonRows } from '../../../shared/ui/Skeleton'
import { StateMessage } from '../../../shared/ui/StateMessage'

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

function StatusSelect({ dog }: { dog: Dog }) {
  const updateDog = useUpdateDog()

  const handleStatusChange = async (status: DogStatus) => {
    try {
      await updateDog.mutateAsync({
        id: dog.id,
        input: { status },
      })
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label={`Status de ${dog.name}`}
        value={dog.status}
        onChange={(event) => handleStatusChange(event.target.value as DogStatus)}
        disabled={updateDog.isPending}
        className="min-h-10 w-full rounded border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-white"
      >
        {(Object.keys(STATUS_LABEL) as DogStatus[]).map((status) => (
          <option key={status} value={status}>
            {STATUS_LABEL[status]}
          </option>
        ))}
      </select>
      {updateDog.isError && (
        <span className="text-xs text-red-600 dark:text-red-400">Falha ao salvar.</span>
      )}
    </div>
  )
}

export default function AdminDogsPage() {
  const { data: dogs, isLoading, isError } = useAllDogs()
  const [editingDog, setEditingDog] = useState<Dog | null>(null)

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-6 sm:p-6">
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

      <DogCreateForm />

      {isError && (
        <StateMessage variant="error">
          Não foi possível carregar os cães. Tente novamente mais tarde.
        </StateMessage>
      )}

      {isLoading && <SkeletonRows />}

      {!isLoading && !isError && dogs && dogs.length === 0 && (
        <StateMessage>
          Nenhum cão cadastrado ainda.
        </StateMessage>
      )}

      {!isLoading && !isError && dogs && dogs.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Porte</th>
                <th className="px-4 py-3 font-medium">Idade</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cadastrado em</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
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
                    <div className="flex min-w-36 flex-col gap-2">
                      <StatusBadge status={dog.status} />
                      <StatusSelect dog={dog} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-500">
                    {new Date(dog.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingDog(dog)}
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

      <DogEditModal
        dog={editingDog}
        onDogChange={setEditingDog}
        onClose={() => setEditingDog(null)}
      />
    </main>
  )
}
