import axios from 'axios'
import {
  type CustomerFormData,
  type ContractFormData,
  type RoomFormData,
  type BranchFormData,
  type PaymentFormData,
  type ScheduleFormData,
  type LoginFormData
} from './validations'
import { mockAPI } from './mockApi'

// Check if we should use mock API
const USE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true'

// API Base Configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types for API responses
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface Customer {
  id: number
  name: string
  phone: string
  email?: string
  address: string
  detailAddress?: string
  businessNumber?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface Room {
  id: number
  roomNumber: string
  floor: number
  roomType: string
  area: number
  monthlyRent: number
  deposit: number
  managementFee?: number
  description?: string
  amenities?: string[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface Contract {
  id: number
  customerId: number
  roomId: number
  customer: Customer
  room: Room
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  managementFee?: number
  note?: string
  status: 'active' | 'expired' | 'terminated'
  createdAt: string
  updatedAt: string
}

export interface Branch {
  id: number
  name: string
  code: string
  address: string
  phone: string
  managerName: string
  managerPhone: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: number
  contractId: number
  contract: Contract
  paymentDate: string
  amount: number
  paymentType: string
  paymentMethod: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface Schedule {
  id: number
  title: string
  description?: string
  startDate: string
  endDate: string
  isAllDay?: boolean
  category: string
  priority?: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

// Auth API
export const authAPI = {
  login: async (data: LoginFormData): Promise<ApiResponse<{ token: string; user: any }>> => {
    if (USE_MOCK_API) {
      return mockAPI.login(data)
    }
    const response = await api.post('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<ApiResponse<void>> => {
    if (USE_MOCK_API) {
      return mockAPI.logout()
    }
    const response = await api.post('/auth/logout')
    localStorage.removeItem('authToken')
    return response.data
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    if (USE_MOCK_API) {
      return mockAPI.getProfile()
    }
    const response = await api.get('/auth/profile')
    return response.data
  },
}

// Customer API
export const customerAPI = {
  getCustomers: async (page = 1, limit = 10, search?: string): Promise<ApiResponse<{ customers: Customer[]; total: number; page: number; totalPages: number }>> => {
    if (USE_MOCK_API) {
      return mockAPI.getCustomers(page, limit, search)
    }
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.append('search', search)
    
    const response = await api.get(`/customers?${params}`)
    return response.data
  },

  getCustomer: async (id: number): Promise<ApiResponse<Customer>> => {
    if (USE_MOCK_API) {
      return mockAPI.getCustomer(id)
    }
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  createCustomer: async (data: CustomerFormData): Promise<ApiResponse<Customer>> => {
    if (USE_MOCK_API) {
      return mockAPI.createCustomer(data)
    }
    const response = await api.post('/customers', data)
    return response.data
  },

  updateCustomer: async (id: number, data: CustomerFormData): Promise<ApiResponse<Customer>> => {
    if (USE_MOCK_API) {
      return mockAPI.updateCustomer(id, data)
    }
    const response = await api.put(`/customers/${id}`, data)
    return response.data
  },

  deleteCustomer: async (id: number): Promise<ApiResponse<void>> => {
    if (USE_MOCK_API) {
      return mockAPI.deleteCustomer(id)
    }
    const response = await api.delete(`/customers/${id}`)
    return response.data
  },
}

// Room API
export const roomAPI = {
  getRooms: async (page = 1, limit = 10, available?: boolean): Promise<ApiResponse<{ rooms: Room[]; total: number; page: number; totalPages: number }>> => {
    if (USE_MOCK_API) {
      return mockAPI.getRooms(page, limit, available)
    }
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (available !== undefined) params.append('available', String(available))
    
    const response = await api.get(`/rooms?${params}`)
    return response.data
  },

  getRoom: async (id: number): Promise<ApiResponse<Room>> => {
    if (USE_MOCK_API) {
      return mockAPI.getRoom(id)
    }
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  createRoom: async (data: RoomFormData): Promise<ApiResponse<Room>> => {
    if (USE_MOCK_API) {
      return mockAPI.createRoom(data)
    }
    const response = await api.post('/rooms', data)
    return response.data
  },

  updateRoom: async (id: number, data: RoomFormData): Promise<ApiResponse<Room>> => {
    const response = await api.put(`/rooms/${id}`, data)
    return response.data
  },

  deleteRoom: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/rooms/${id}`)
    return response.data
  },
}

// Contract API
export const contractAPI = {
  getContracts: async (page = 1, limit = 10, status?: string): Promise<ApiResponse<{ contracts: Contract[]; total: number; page: number; totalPages: number }>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) params.append('status', status)
    
    const response = await api.get(`/contracts?${params}`)
    return response.data
  },

  getContract: async (id: number): Promise<ApiResponse<Contract>> => {
    const response = await api.get(`/contracts/${id}`)
    return response.data
  },

  createContract: async (data: ContractFormData): Promise<ApiResponse<Contract>> => {
    if (USE_MOCK_API) {
      return mockAPI.createContract(data)
    }
    const response = await api.post('/contracts', data)
    return response.data
  },

  updateContract: async (id: number, data: ContractFormData): Promise<ApiResponse<Contract>> => {
    const response = await api.put(`/contracts/${id}`, data)
    return response.data
  },

  deleteContract: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/contracts/${id}`)
    return response.data
  },
}

// Branch API
export const branchAPI = {
  getBranches: async (): Promise<ApiResponse<Branch[]>> => {
    const response = await api.get('/branches')
    return response.data
  },

  getBranch: async (id: number): Promise<ApiResponse<Branch>> => {
    const response = await api.get(`/branches/${id}`)
    return response.data
  },

  createBranch: async (data: BranchFormData): Promise<ApiResponse<Branch>> => {
    const response = await api.post('/branches', data)
    return response.data
  },

  updateBranch: async (id: number, data: BranchFormData): Promise<ApiResponse<Branch>> => {
    const response = await api.put(`/branches/${id}`, data)
    return response.data
  },

  deleteBranch: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/branches/${id}`)
    return response.data
  },
}

// Payment API
export const paymentAPI = {
  getPayments: async (page = 1, limit = 10, contractId?: number): Promise<ApiResponse<{ payments: Payment[]; total: number; page: number; totalPages: number }>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (contractId) params.append('contractId', String(contractId))
    
    const response = await api.get(`/payments?${params}`)
    return response.data
  },

  getPayment: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await api.get(`/payments/${id}`)
    return response.data
  },

  createPayment: async (data: PaymentFormData): Promise<ApiResponse<Payment>> => {
    const response = await api.post('/payments', data)
    return response.data
  },

  updatePayment: async (id: number, data: PaymentFormData): Promise<ApiResponse<Payment>> => {
    const response = await api.put(`/payments/${id}`, data)
    return response.data
  },

  deletePayment: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/payments/${id}`)
    return response.data
  },
}

// Schedule API
export const scheduleAPI = {
  getSchedules: async (startDate?: string, endDate?: string): Promise<ApiResponse<Schedule[]>> => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const response = await api.get(`/schedules?${params}`)
    return response.data
  },

  getSchedule: async (id: number): Promise<ApiResponse<Schedule>> => {
    const response = await api.get(`/schedules/${id}`)
    return response.data
  },

  createSchedule: async (data: ScheduleFormData): Promise<ApiResponse<Schedule>> => {
    const response = await api.post('/schedules', data)
    return response.data
  },

  updateSchedule: async (id: number, data: ScheduleFormData): Promise<ApiResponse<Schedule>> => {
    const response = await api.put(`/schedules/${id}`, data)
    return response.data
  },

  deleteSchedule: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/schedules/${id}`)
    return response.data
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse<{
    totalCustomers: number
    totalRooms: number
    occupiedRooms: number
    totalContracts: number
    monthlyRevenue: number
    occupancyRate: number
  }>> => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  getRecentActivities: async (limit = 10): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/dashboard/activities?limit=${limit}`)
    return response.data
  },

  getMonthlyRevenue: async (year: number): Promise<ApiResponse<{ month: number; revenue: number }[]>> => {
    const response = await api.get(`/dashboard/revenue?year=${year}`)
    return response.data
  },
}

export default api