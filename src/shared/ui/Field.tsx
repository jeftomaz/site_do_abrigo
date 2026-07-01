import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  error?: string
  hint?: string
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input'
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
  rows?: number
}

type Props = InputProps | TextareaProps

const inputClass = (error?: string, extra = '') =>
  [
    'min-h-10 w-full rounded border px-3 py-2 text-sm outline-none',
    'focus:ring-2 focus:ring-black dark:focus:ring-white',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600',
    extra,
  ]
    .filter(Boolean)
    .join(' ')

const Field = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  function Field(props, ref) {
    const { label, error, hint, id, ...rest } = props
    const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const describedBy = errorId ?? hintId

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>

        {props.as === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            rows={props.rows ?? 4}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={inputClass(error, (rest as TextareaHTMLAttributes<HTMLTextAreaElement>).className)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            className={inputClass(error, (rest as InputHTMLAttributes<HTMLInputElement>).className)}
          />
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  },
)

export default Field
