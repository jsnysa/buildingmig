import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Plus, Search, Eye, Edit, Loader2, FileText } from "lucide-react"
import { formatCurrency, formatDate } from "../lib/utils"

interface Contract {
  id: number
  customerName: string
  roomNumber: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: 'active' | 'expiring' | 'expired'
}

export function Contract() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    room: '',
    customer: ''
  })

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    setLoading(true)
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockContracts: Contract[] = [
        {
          id: 1,
          customerName: '김철수',
          roomNumber: '101',
          startDate: '2024-01-15',
          endDate: '2025-01-14',
          monthlyRent: 800000,
          deposit: 10000000,
          status: 'active'
        },
        {
          id: 2,
          customerName: '박영희',
          roomNumber: '102',
          startDate: '2023-12-01',
          endDate: '2024-11-30',
          monthlyRent: 750000,
          deposit: 8000000,
          status: 'expiring'
        },
        {
          id: 3,
          customerName: '이민수',
          roomNumber: '201',
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          monthlyRent: 900000,
          deposit: 12000000,
          status: 'active'
        },
        {
          id: 4,
          customerName: '최지영',
          roomNumber: '202',
          startDate: '2024-03-01',
          endDate: '2025-02-28',
          monthlyRent: 850000,
          deposit: 11000000,
          status: 'active'
        },
        {
          id: 5,
          customerName: '정우진',
          roomNumber: '301',
          startDate: '2023-11-15',
          endDate: '2024-11-14',
          monthlyRent: 950000,
          deposit: 13000000,
          status: 'expiring'
        }
      ]
      
      setContracts(mockContracts)
    } catch (error) {
      console.error('Failed to load contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddContract = () => {
    alert('새 계약 등록 기능은 구현 예정입니다.')
  }

  const handleViewContract = (contractId: number) => {
    alert(`계약 ID ${contractId} 상세보기 (구현 예정)`)
  }

  const handleEditContract = (contractId: number) => {
    alert(`계약 ID ${contractId} 편집 (구현 예정)`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성'
      case 'expiring':
        return '만료예정'
      case 'expired':
        return '만료됨'
      default:
        return '알 수 없음'
    }
  }

  // 필터링된 계약 목록
  const filteredContracts = contracts.filter(contract => {
    if (filters.status && contract.status !== filters.status) return false
    if (filters.room && !contract.roomNumber.includes(filters.room)) return false
    if (filters.customer && !contract.customerName.includes(filters.customer)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">계약 관리</CardTitle>
              <CardDescription>
                전체 계약 정보를 조회하고 관리하세요
              </CardDescription>
            </div>
            <Button onClick={handleAddContract}>
              <Plus className="mr-2 h-4 w-4" />
              새 계약 등록
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>검색 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
                계약 상태
              </label>
              <select
                id="statusFilter"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">전체</option>
                <option value="active">활성</option>
                <option value="expiring">만료 예정</option>
                <option value="expired">만료됨</option>
              </select>
            </div>
            <div>
              <label htmlFor="roomFilter" className="block text-sm font-medium mb-1">
                방 번호
              </label>
              <Input
                id="roomFilter"
                placeholder="방 번호 검색"
                value={filters.room}
                onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="customerFilter" className="block text-sm font-medium mb-1">
                고객명
              </label>
              <Input
                id="customerFilter"
                placeholder="고객명 검색"
                value={filters.customer}
                onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadContracts} variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                검색
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>계약 목록</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                총 {filteredContracts.length}건
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredContracts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      고객명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      방 번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      계약기간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      월세
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      보증금
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {contract.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {contract.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatCurrency(contract.monthlyRent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatCurrency(contract.deposit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(contract.status)}`}>
                          {getStatusText(contract.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContract(contract.id)}
                          className="mr-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditContract(contract.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium">계약이 없습니다</h3>
                <p className="mt-1">새로운 계약을 등록해보세요.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}