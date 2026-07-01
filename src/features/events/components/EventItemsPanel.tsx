import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { SkeletonRows } from '../../../shared/ui/Skeleton'
import { StateMessage } from '../../../shared/ui/StateMessage'
import { formatPriceCents } from '../format'
import { useProducts, useRaffleNumbers } from '../hooks'
import type { Event, Product, RaffleNumber } from '../types'
import { ProductCreateForm } from './ProductCreateForm'
import { ProductEditModal } from './ProductEditModal'
import { RaffleNumberCreateForm } from './RaffleNumberCreateForm'
import { RaffleNumberEditModal } from './RaffleNumberEditModal'

interface EventItemsPanelProps {
  event: Event
}

export function EventItemsPanel({ event }: EventItemsPanelProps) {
  if (event.type === 'product') {
    return <ProductItemsPanel event={event} />
  }

  return <RaffleNumberItemsPanel event={event} />
}

function ProductItemsPanel({ event }: { event: Event }) {
  const { data: products, isLoading, isError } = useProducts(event.id)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
      <PanelHeader title="Produtos" eventTitle={event.title} />
      <ProductCreateForm event={event} />

      {isLoading && <LoadingRows />}
      {isError && <ErrorMessage message="Não foi possível carregar os produtos." />}

      {!isLoading && !isError && products && products.length === 0 && (
        <EmptyMessage message="Nenhum produto cadastrado neste evento." />
      )}

      {!isLoading && !isError && products && products.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Ordem</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                    {product.description && (
                      <p className="mt-1 text-gray-500 dark:text-gray-400">{product.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {formatPriceCents(product.price_cents)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {product.sort_order}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
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

      <ProductEditModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </section>
  )
}

function RaffleNumberItemsPanel({ event }: { event: Event }) {
  const { data: raffleNumbers, isLoading, isError } = useRaffleNumbers(event.id)
  const [editingRaffleNumber, setEditingRaffleNumber] =
    useState<RaffleNumber | null>(null)

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
      <PanelHeader title="Números da rifa" eventTitle={event.title} />
      <RaffleNumberCreateForm event={event} />

      {isLoading && <LoadingRows />}
      {isError && <ErrorMessage message="Não foi possível carregar os números." />}

      {!isLoading && !isError && raffleNumbers && raffleNumbers.length === 0 && (
        <EmptyMessage message="Nenhum número cadastrado neste evento." />
      )}

      {!isLoading && !isError && raffleNumbers && raffleNumbers.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Número</th>
                <th className="px-4 py-3 font-medium">Rótulo</th>
                <th className="px-4 py-3 font-medium">Ordem</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {raffleNumbers.map((raffleNumber) => (
                <tr key={raffleNumber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {raffleNumber.number}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {raffleNumber.label ?? <span className="text-gray-400 dark:text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {raffleNumber.sort_order}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingRaffleNumber(raffleNumber)}
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

      <RaffleNumberEditModal
        raffleNumber={editingRaffleNumber}
        onClose={() => setEditingRaffleNumber(null)}
      />
    </section>
  )
}

function PanelHeader({
  title,
  eventTitle,
}: {
  title: string
  eventTitle: string
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Evento: {eventTitle}
      </p>
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="mt-5">
      <SkeletonRows rows={3} />
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <StateMessage className="mt-5" variant="error">
      {message}
    </StateMessage>
  )
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <StateMessage className="mt-5">
      {message}
    </StateMessage>
  )
}
