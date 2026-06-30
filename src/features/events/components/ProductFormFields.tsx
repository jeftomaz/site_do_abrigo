import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import {
  validateMoneyInput,
  validateOptionalInteger,
  type ProductFormValues,
} from '../itemForms'
import Field from '../../../shared/ui/Field'

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>
  errors: FieldErrors<ProductFormValues>
  idPrefix: string
}

export function ProductFormFields({
  register,
  errors,
  idPrefix,
}: ProductFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <Field
        id={`${idPrefix}-name`}
        label="Nome"
        placeholder="Ex.: Camiseta solidária"
        autoComplete="off"
        error={errors.name?.message}
        {...register('name', {
          required: 'Informe o nome.',
          validate: (value) => value.trim().length > 0 || 'Informe o nome.',
        })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${idPrefix}-price`}
          label="Preço (R$)"
          inputMode="decimal"
          placeholder="25,00"
          error={errors.price?.message}
          {...register('price', { validate: validateMoneyInput })}
        />

        <Field
          id={`${idPrefix}-sort-order`}
          label="Ordem"
          type="number"
          inputMode="numeric"
          hint="Menor número aparece primeiro."
          error={errors.sort_order?.message}
          {...register('sort_order', { validate: validateOptionalInteger })}
        />
      </div>

      <Field
        as="textarea"
        id={`${idPrefix}-description`}
        label="Descrição"
        rows={3}
        placeholder="Detalhes do produto, tamanho, condição..."
        error={errors.description?.message}
        {...register('description')}
      />
    </div>
  )
}
