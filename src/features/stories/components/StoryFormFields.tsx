import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { Dog } from '../../dogs/types'
import type { StoryFormValues } from '../form'
import Field from '../../../shared/ui/Field'

interface StoryFormFieldsProps {
  register: UseFormRegister<StoryFormValues>
  errors: FieldErrors<StoryFormValues>
  idPrefix: string
  dogs: Dog[]
}

export function StoryFormFields({ register, errors, idPrefix, dogs }: StoryFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <Field
        id={`${idPrefix}-title`}
        label="Título"
        placeholder="Ex.: Mel encontrou uma família"
        autoComplete="off"
        error={errors.title?.message}
        {...register('title', {
          required: 'Informe o título.',
          validate: (v) => v.trim().length > 0 || 'Informe o título.',
        })}
      />

      <Field
        as="textarea"
        id={`${idPrefix}-body`}
        label="Texto"
        rows={6}
        placeholder="Conte a história de adoção..."
        error={errors.body?.message}
        {...register('body', {
          required: 'Informe o texto.',
          validate: (v) => v.trim().length > 0 || 'Informe o texto.',
        })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`${idPrefix}-dog`}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Cão relacionado
          </label>
          <select
            id={`${idPrefix}-dog`}
            className="min-h-10 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-white"
            {...register('dog_id')}
          >
            <option value="">Nenhum</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>
                {dog.name}
              </option>
            ))}
          </select>
        </div>

        <Field
          id={`${idPrefix}-published-at`}
          label="Data de publicação"
          type="date"
          error={errors.published_at?.message}
          {...register('published_at', { required: 'Informe a data.' })}
        />
      </div>
    </div>
  )
}
