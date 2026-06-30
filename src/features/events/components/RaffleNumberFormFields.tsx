import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import {
  validateOptionalInteger,
  validatePositiveInteger,
  type RaffleNumberFormValues,
} from '../itemForms'
import Field from '../../../shared/ui/Field'

interface RaffleNumberFormFieldsProps {
  register: UseFormRegister<RaffleNumberFormValues>
  errors: FieldErrors<RaffleNumberFormValues>
  idPrefix: string
}

export function RaffleNumberFormFields({
  register,
  errors,
  idPrefix,
}: RaffleNumberFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${idPrefix}-number`}
          label="Número"
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="21"
          error={errors.number?.message}
          {...register('number', { validate: validatePositiveInteger })}
        />

        <Field
          id={`${idPrefix}-sort-order`}
          label="Ordem"
          type="number"
          inputMode="numeric"
          hint="Use para destacar números específicos."
          error={errors.sort_order?.message}
          {...register('sort_order', { validate: validateOptionalInteger })}
        />
      </div>

      <Field
        id={`${idPrefix}-label`}
        label="Rótulo"
        placeholder="Ex.: Número da sorte"
        autoComplete="off"
        hint="Opcional."
        error={errors.label?.message}
        {...register('label')}
      />
    </div>
  )
}
