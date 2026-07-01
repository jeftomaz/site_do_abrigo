import type { ReactNode } from 'react'

type StateMessageVariant = 'empty' | 'error' | 'info'

interface StateMessageProps {
  children: ReactNode
  className?: string
  title?: string
  variant?: StateMessageVariant
}

const variantClasses: Record<StateMessageVariant, string> = {
  empty:
    'border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400',
  error:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200',
  info:
    'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200',
}

export function StateMessage({
  children,
  className = '',
  title,
  variant = 'empty',
}: StateMessageProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className={[
        'rounded-lg border p-4 text-sm',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {title && (
        <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
      )}
      <p>{children}</p>
    </div>
  )
}
