import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  emptyProductFormValues,
  productFormValuesToPayload,
  type ProductFormValues,
} from '../itemForms'
import { useCreateProduct } from '../hooks'
import type { Event } from '../types'
import { Button } from '../../../shared/ui/Button'
import { ProductFormFields } from './ProductFormFields'

interface ProductCreateFormProps {
  event: Event
}

export function ProductCreateForm({ event }: ProductCreateFormProps) {
  const createProduct = useCreateProduct()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: emptyProductFormValues(),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null)

    try {
      const product = await createProduct.mutateAsync(
        productFormValuesToPayload(values, event.id),
      )
      reset(emptyProductFormValues())
      setSuccessMessage(`"${product.name}" foi cadastrado.`)
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        Cadastrar produto
      </h3>

      <ProductFormFields
        register={register}
        errors={errors}
        idPrefix="product-create"
      />

      {createProduct.isError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Não foi possível cadastrar o produto. Verifique sua sessão e tente novamente.
        </p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-green-700 dark:text-green-300">
          {successMessage}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={createProduct.isPending}>
          Cadastrar produto
        </Button>
      </div>
    </form>
  )
}
