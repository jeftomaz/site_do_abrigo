import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import {
  validateReservationExpiresInHours,
  type EventFormValues,
} from '../form'
import Field from '../../../shared/ui/Field'

interface EventFormFieldsProps {
  register: UseFormRegister<EventFormValues>
  errors: FieldErrors<EventFormValues>
  idPrefix: string
}

export function EventFormFields({
  register,
  errors,
  idPrefix,
}: EventFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <Field
        id={`${idPrefix}-title`}
        label="Título"
        placeholder="Ex.: Recãopensa de julho"
        autoComplete="off"
        error={errors.title?.message}
        {...register('title', {
          required: 'Informe o título.',
          validate: (value) => value.trim().length > 0 || 'Informe o título.',
        })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`${idPrefix}-type`}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tipo
          </label>
          <select
            id={`${idPrefix}-type`}
            className="min-h-10 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-white"
            {...register('type')}
          >
            <option value="raffle">Rifa</option>
            <option value="product">Produtos</option>
          </select>
        </div>

        <Field
          id={`${idPrefix}-reservation-expires-in-hours`}
          label="Prazo da reserva"
          type="number"
          inputMode="numeric"
          min={1}
          max={168}
          placeholder="6"
          hint="Em horas. Deixe vazio para usar o padrão do banco."
          error={errors.reservation_expires_in_hours?.message}
          {...register('reservation_expires_in_hours', {
            validate: validateReservationExpiresInHours,
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${idPrefix}-starts-at`}
          label="Início"
          type="date"
          error={errors.starts_at?.message}
          {...register('starts_at')}
        />

        <Field
          id={`${idPrefix}-ends-at`}
          label="Encerramento"
          type="date"
          error={errors.ends_at?.message}
          {...register('ends_at')}
        />
      </div>

      <Field
        as="textarea"
        id={`${idPrefix}-description`}
        label="Descrição"
        rows={4}
        placeholder="Detalhes do evento, objetivo da arrecadação e instruções gerais..."
        error={errors.description?.message}
        {...register('description')}
      />

      <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-white"
          {...register('is_active')}
        />
        <span>
          <span className="block font-medium text-gray-900 dark:text-gray-100">
            Evento ativo
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            O banco permite apenas um evento ativo por vez.
          </span>
        </span>
      </label>
    </div>
  )
}
