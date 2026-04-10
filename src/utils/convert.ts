import type { Decimal } from '@prisma/client/runtime/library'

export const formatarNumeroMonetario = (value: number | Decimal | null) => {
  if (!value) return '-'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

export const formatarNumeroMonetarioUSD = (value: number | Decimal | null) => {
  if (!value) return '-'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))
}

export const formatarNumero = (value: number | Decimal | null) => {
  if (!value) return '-'
  return new Intl.NumberFormat('pt-BR').format(Number(value))
}

export const stringToNumber = (value: string | Decimal | null) => {
  if (value === '') return null
  if (value === undefined) return undefined
  if (value === null) return undefined
  return Number(String(value).replace(',', '.'))
}
