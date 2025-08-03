import { useApi, useApiMutation } from './useApi'
import { contractAPI, type Contract } from '../lib/api'
import { type ContractFormData } from '../lib/validations'

// Hook for fetching contracts list
export function useContracts(page = 1, limit = 10, status?: string) {
  return useApi(
    () => contractAPI.getContracts(page, limit, status),
    [page, limit, status]
  )
}

// Hook for fetching single contract
export function useContract(id: number) {
  return useApi(
    () => contractAPI.getContract(id),
    [id]
  )
}

// Hook for creating contract
export function useCreateContract() {
  return useApiMutation<{ success: boolean; data: Contract }, ContractFormData>(
    (data: ContractFormData) => contractAPI.createContract(data)
  )
}

// Hook for updating contract
export function useUpdateContract() {
  return useApiMutation<{ success: boolean; data: Contract }, { id: number; data: ContractFormData }>(
    ({ id, data }) => contractAPI.updateContract(id, data)
  )
}

// Hook for deleting contract
export function useDeleteContract() {
  return useApiMutation<{ success: boolean }, number>(
    (id: number) => contractAPI.deleteContract(id)
  )
}