import { useState, useEffect, useCallback } from 'react'
import { AxiosError } from 'axios'

// Generic API hook for handling loading states and errors
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || err.message
        : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook for API mutations (create, update, delete)
export function useApiMutation<TData, TVariables = void>(
  mutationFunction: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFunction(variables)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || err.message
        : 'An unexpected error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutationFunction])

  return { data, loading, error, mutate }
}

// Hook with optimistic updates
export function useOptimisticMutation<TData, TVariables = void>(
  mutationFunction: (variables: TVariables) => Promise<TData>,
  optimisticUpdate?: (variables: TVariables) => TData
) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true)
      setError(null)
      
      // Apply optimistic update if provided
      if (optimisticUpdate) {
        const optimisticData = optimisticUpdate(variables)
        setData(optimisticData)
      }

      const result = await mutationFunction(variables)
      setData(result)
      return result
    } catch (err) {
      // Revert optimistic update on error
      setData(null)
      
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || err.message
        : 'An unexpected error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutationFunction, optimisticUpdate])

  return { data, loading, error, mutate }
}