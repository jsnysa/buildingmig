import { useApi, useApiMutation } from './useApi'
import { customerAPI, type Customer } from '../lib/api'
import { type CustomerFormData } from '../lib/validations'

// Hook for fetching customers list
export function useCustomers(page = 1, limit = 10, search?: string) {
  return useApi(
    () => customerAPI.getCustomers(page, limit, search),
    [page, limit, search]
  )
}

// Hook for fetching single customer
export function useCustomer(id: number) {
  return useApi(
    () => customerAPI.getCustomer(id),
    [id]
  )
}

// Hook for creating customer
export function useCreateCustomer() {
  return useApiMutation<{ success: boolean; data: Customer }, CustomerFormData>(
    (data: CustomerFormData) => customerAPI.createCustomer(data)
  )
}

// Hook for updating customer
export function useUpdateCustomer() {
  return useApiMutation<{ success: boolean; data: Customer }, { id: number; data: CustomerFormData }>(
    ({ id, data }) => customerAPI.updateCustomer(id, data)
  )
}

// Hook for deleting customer
export function useDeleteCustomer() {
  return useApiMutation<{ success: boolean }, number>(
    (id: number) => customerAPI.deleteCustomer(id)
  )
}