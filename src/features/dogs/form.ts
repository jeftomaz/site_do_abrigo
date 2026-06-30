import type { Dog } from './types'

export interface DogFormValues {
  name: string
  size: string
  ageYears: string
  description: string
}

export function emptyDogFormValues(): DogFormValues {
  return {
    name: '',
    size: '',
    ageYears: '',
    description: '',
  }
}

export function dogToFormValues(dog: Dog): DogFormValues {
  return {
    name: dog.name,
    size: dog.size ?? '',
    ageYears: birthYearToAgeYears(dog.birth_year),
    description: dog.description ?? '',
  }
}

export function dogFormValuesToPayload(values: DogFormValues) {
  return {
    name: values.name.trim(),
    size: values.size || null,
    birth_year: ageToBirthYear(values.ageYears),
    description: values.description.trim() || null,
  }
}

export function validateAgeYears(value: string): true | string {
  const normalized = value.trim()
  if (!normalized) return true

  const age = Number(normalized)
  if (!Number.isInteger(age)) return 'Use um número inteiro.'
  if (age < 0) return 'A idade não pode ser negativa.'
  if (age > 40) return 'Confira a idade informada.'
  return true
}

function ageToBirthYear(ageYears: string): number | null {
  const normalized = ageYears.trim()
  if (!normalized) return null
  return new Date().getFullYear() - Number(normalized)
}

function birthYearToAgeYears(birthYear: number | null): string {
  if (birthYear == null) return ''

  const age = new Date().getFullYear() - birthYear
  return age < 0 ? '' : String(age)
}
