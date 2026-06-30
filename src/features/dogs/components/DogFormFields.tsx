import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { DOG_SIZE_OPTIONS } from '../constants'
import { validateAgeYears, type DogFormValues } from '../form'
import Field from '../../../shared/ui/Field'

interface DogFormFieldsProps {
  register: UseFormRegister<DogFormValues>
  errors: FieldErrors<DogFormValues>
  idPrefix: string
}

export function DogFormFields({ register, errors, idPrefix }: DogFormFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field
        id={`${idPrefix}-name`}
        label="Nome"
        placeholder="Ex.: Mel"
        autoComplete="off"
        error={errors.name?.message}
        {...register('name', {
          required: 'Informe o nome.',
          validate: (value) => value.trim().length > 0 || 'Informe o nome.',
        })}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${idPrefix}-size`}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Porte
        </label>
        <select
          id={`${idPrefix}-size`}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-white"
          {...register('size')}
        >
          <option value="">Não informado</option>
          {DOG_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size[0].toUpperCase() + size.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Field
        id={`${idPrefix}-age-years`}
        label="Idade aproximada"
        type="number"
        inputMode="numeric"
        min={0}
        max={40}
        placeholder="Ex.: 3"
        hint="Use 0 para menos de 1 ano. Deixe vazio se não souber."
        error={errors.ageYears?.message}
        {...register('ageYears', { validate: validateAgeYears })}
      />

      <Field
        as="textarea"
        id={`${idPrefix}-description`}
        label="Descrição"
        rows={4}
        placeholder="Temperamento, histórico, cuidados..."
        className="md:min-h-[126px]"
        error={errors.description?.message}
        {...register('description')}
      />
    </div>
  )
}
