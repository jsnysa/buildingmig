// Mock API implementation for development
import {
  type CustomerFormData,
  type ContractFormData,
  type RoomFormData,
  type LoginFormData
} from './validations'
import type {
  ApiResponse,
  Customer,
  Room,
  Contract
} from './api'

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "김철수",
    phone: "010-1234-5678",
    email: "kim@example.com",
    address: "서울시 강남구 역삼동 123-45",
    detailAddress: "101동 102호",
    businessNumber: "123-45-67890",
    note: "VIP 고객",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: 2,
    name: "박영희",
    phone: "010-2345-6789",
    email: "park@example.com",
    address: "서울시 서초구 서초동 456-78",
    detailAddress: "202동 203호",
    note: "장기 계약 고객",
    createdAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T10:30:00Z"
  },
  {
    id: 3,
    name: "이민수",
    phone: "010-3456-7890",
    email: "lee@example.com",
    address: "서울시 송파구 잠실동 789-12",
    detailAddress: "303동 304호",
    businessNumber: "987-65-43210",
    note: "신규 고객",
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z"
  }
]

const mockRooms: Room[] = [
  {
    id: 1,
    roomNumber: "101",
    floor: 1,
    roomType: "원룸",
    area: 25.5,
    monthlyRent: 800000,
    deposit: 10000000,
    managementFee: 100000,
    description: "남향 원룸, 신축",
    amenities: ["에어컨", "냉장고", "세탁기"],
    isAvailable: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    roomNumber: "102",
    floor: 1,
    roomType: "투룸",
    area: 35.8,
    monthlyRent: 1200000,
    deposit: 15000000,
    managementFee: 120000,
    description: "넓은 투룸, 베란다 있음",
    amenities: ["에어컨", "냉장고", "세탁기", "인덕션"],
    isAvailable: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    roomNumber: "201",
    floor: 2,
    roomType: "원룸",
    area: 28.2,
    monthlyRent: 900000,
    deposit: 12000000,
    managementFee: 110000,
    description: "고층 원룸, 조망 좋음",
    amenities: ["에어컨", "냉장고"],
    isAvailable: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

// Utility function to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const mockAPI = {
  // Auth
  async login(data: LoginFormData): Promise<ApiResponse<{ token: string; user: any }>> {
    await delay()
    
    // 테스트 계정들
    const testAccounts = [
      {
        userId: "admin",
        password: "admin",
        user: {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          name: "관리자"
        }
      },
      {
        userId: "user",
        password: "user",
        user: {
          id: 2,
          username: "user",
          email: "user@example.com",
          role: "user",
          name: "일반사용자"
        }
      },
      {
        userId: "test",
        password: "test",
        user: {
          id: 3,
          username: "test",
          email: "test@example.com",
          role: "user",
          name: "테스트사용자"
        }
      }
    ]
    
    const account = testAccounts.find(acc => 
      acc.userId === data.userId && acc.password === data.password
    )
    
    if (account) {
      return {
        success: true,
        data: {
          token: `mock-jwt-token-${account.user.id}`,
          user: account.user
        }
      }
    }
    
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
  },

  async logout(): Promise<ApiResponse<void>> {
    await delay(200)
    return { success: true, data: undefined }
  },

  async getProfile(): Promise<ApiResponse<any>> {
    await delay(300)
    return {
      success: true,
      data: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        name: "관리자"
      }
    }
  },

  // Customers
  async getCustomers(page = 1, limit = 10, search?: string): Promise<ApiResponse<{ customers: Customer[]; total: number; page: number; totalPages: number }>> {
    await delay()
    
    let filteredCustomers = mockCustomers
    if (search) {
      filteredCustomers = mockCustomers.filter(customer => 
        customer.name.includes(search) || 
        customer.phone.includes(search) ||
        customer.email?.includes(search)
      )
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: {
        customers: paginatedCustomers,
        total: filteredCustomers.length,
        page,
        totalPages: Math.ceil(filteredCustomers.length / limit)
      }
    }
  },

  async getCustomer(id: number): Promise<ApiResponse<Customer>> {
    await delay()
    const customer = mockCustomers.find(c => c.id === id)
    if (!customer) {
      throw new Error("고객을 찾을 수 없습니다.")
    }
    return { success: true, data: customer }
  },

  async createCustomer(data: CustomerFormData): Promise<ApiResponse<Customer>> {
    await delay()
    const newCustomer: Customer = {
      id: Math.max(...mockCustomers.map(c => c.id)) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockCustomers.push(newCustomer)
    return { success: true, data: newCustomer }
  },

  async updateCustomer(id: number, data: CustomerFormData): Promise<ApiResponse<Customer>> {
    await delay()
    const index = mockCustomers.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error("고객을 찾을 수 없습니다.")
    }
    
    const updatedCustomer: Customer = {
      ...mockCustomers[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    mockCustomers[index] = updatedCustomer
    return { success: true, data: updatedCustomer }
  },

  async deleteCustomer(id: number): Promise<ApiResponse<void>> {
    await delay()
    const index = mockCustomers.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error("고객을 찾을 수 없습니다.")
    }
    mockCustomers.splice(index, 1)
    return { success: true, data: undefined }
  },

  // Rooms
  async getRooms(page = 1, limit = 10, available?: boolean): Promise<ApiResponse<{ rooms: Room[]; total: number; page: number; totalPages: number }>> {
    await delay()
    
    let filteredRooms = mockRooms
    if (available !== undefined) {
      filteredRooms = mockRooms.filter(room => room.isAvailable === available)
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRooms = filteredRooms.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: {
        rooms: paginatedRooms,
        total: filteredRooms.length,
        page,
        totalPages: Math.ceil(filteredRooms.length / limit)
      }
    }
  },

  async getRoom(id: number): Promise<ApiResponse<Room>> {
    await delay()
    const room = mockRooms.find(r => r.id === id)
    if (!room) {
      throw new Error("방을 찾을 수 없습니다.")
    }
    return { success: true, data: room }
  },

  async createRoom(data: RoomFormData): Promise<ApiResponse<Room>> {
    await delay()
    const newRoom: Room = {
      id: Math.max(...mockRooms.map(r => r.id)) + 1,
      ...data,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockRooms.push(newRoom)
    return { success: true, data: newRoom }
  },

  // Contracts - simplified for now
  async createContract(data: ContractFormData): Promise<ApiResponse<Contract>> {
    await delay()
    const customer = mockCustomers.find(c => c.id === data.customerId)
    const room = mockRooms.find(r => r.id === data.roomId)
    
    if (!customer || !room) {
      throw new Error("고객 또는 방 정보를 찾을 수 없습니다.")
    }

    const newContract: Contract = {
      id: Math.floor(Math.random() * 1000) + 1,
      customerId: data.customerId,
      roomId: data.roomId,
      customer,
      room,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      monthlyRent: data.monthlyRent,
      deposit: data.deposit,
      managementFee: data.managementFee,
      note: data.note,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Mark room as unavailable
    room.isAvailable = false
    
    return { success: true, data: newContract }
  }
}