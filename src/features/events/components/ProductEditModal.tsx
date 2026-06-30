import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  emptyProductFormValues,
  productFormValuesToPayload,
  productToFormValues,
  type ProductFormValues,
} from '../itemForms'
import { useUpdateProduct } from '../hooks'
import type { Product } from '../types'
import { Button } from '../../../shared/ui/Button'
import Modal from '../../../shared/ui/Modal'
import { ProductFormFields } from './ProductFormFields'

interface ProductEditModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductEditModal({ product, onClose }: ProductEditModalProps) {
  const updateProduct = useUpdateProduct()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: emptyProductFormValues(),
  })

  useEffect(() => {
    reset(product ? productToFormValues(product) : emptyProductFormValues())
    updateProduct.reset()
  }, [product, reset])

  const handleClose = () => {
    if (updateProduct.isPending) return
    onClose()
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!product) return

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        input: productFormValuesToPayload(values, product.event_id),
      })
      onClose()
    } catch {
      // A mensagem de erro vem do estado da mutation.
    }
  })

  return (
    <Modal open={product !== null} onClose={handleClose} title="Editar produto">
      <form onSubmit={onSubmit}>
        <ProductFormFields
          register={register}
          errors={errors}
          idPrefix="product-edit"
        />

        {updateProduct.isError && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Não foi possível salvar as alterações. Verifique sua sessão e tente novamente.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={updateProduct.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={updateProduct.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  )
}
