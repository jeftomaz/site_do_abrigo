interface Props {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function SkeletonRows({
  rows = 5,
  className = 'h-12 w-full rounded-lg',
}: {
  className?: string
  rows?: number
}) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  )
}

export function PageLoadingFallback({
  title = 'Carregando...',
}: {
  title?: string
}) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="mx-auto max-w-4xl p-6"
    >
      <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <SkeletonRows rows={4} />
    </main>
  )
}
