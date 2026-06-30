export const DOGS_BUCKET = 'dogs'

export const DOG_SIZE_OPTIONS = ['filhote', 'pequeno', 'médio', 'grande', 'gigante'] as const

export const DOG_SIZE_ORDER: Record<string, number> = {
  filhote: 0,
  pequeno: 1,
  médio: 2,
  grande: 3,
  gigante: 4,
}
