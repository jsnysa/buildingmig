import { useState, useEffect, useCallback, useRef } from 'react'
import { useApiMutation } from './useApi'
import { authAPI } from '../lib/api'
import { type LoginFormData } from '../lib/validations'

interface User {
  id: number
  username: string
  email: string
  role: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Hook for authentication state management
export function useAuth() {
  const isMountedRef = useRef(true)
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Login mutation
  const loginMutation = useApiMutation<
    { success: boolean; data: { token: string; user: User } },
    LoginFormData
  >((data: LoginFormData) => authAPI.login(data))

  // Logout mutation
  const logoutMutation = useApiMutation<{ success: boolean }, void>(
    () => authAPI.logout()
  )

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        const response = await authAPI.getProfile()
        if (response.success) {
          setAuthState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          localStorage.removeItem('authToken')
          setAuthState({ user: null, isAuthenticated: false, isLoading: false })
        }
      } catch (error) {
        localStorage.removeItem('authToken')
        setAuthState({ user: null, isAuthenticated: false, isLoading: false })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = useCallback(async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutate(data)
      if (response.success) {
        localStorage.setItem('authToken', response.data.token)
        // 상태 업데이트를 지연시켜 DOM 오류 방지
        setTimeout(() => {
          if (isMountedRef.current) {
            setAuthState({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        }, 0)
        return response
      }
    } catch (error) {
      throw error
    }
  }, [loginMutation])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutate()
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [logoutMutation])

  return {
    ...authState,
    login,
    logout,
    loginLoading: loginMutation.loading,
    loginError: loginMutation.error,
    logoutLoading: logoutMutation.loading,
  }
}