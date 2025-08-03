import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR')
}