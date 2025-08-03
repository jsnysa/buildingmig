import { useState } from "react"
import { useContracts, useDeleteContract } from "../hooks/useContracts"
import { ContractForm } from "../components/forms/ContractForm"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, Edit, Trash2, Calendar, DollarSign, Loader2, FileText, User, Home } from "lucide-react"
import { type Contract } from "../lib/api"
import { formatCurrency } from "../lib/utils"

export function Contracts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const { data: contractsData, loading, error, refetch } = useContracts(currentPage, 10, statusFilter)
  const deleteContract = useDeleteContract()

  const contracts = contractsData?.data?.contracts || []
  const totalPages = contractsData?.data?.totalPages || 1
  const total = contractsData?.data?.total || 0

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteContract.mutate(id)
      setShowDeleteConfirm(null)
      refetch()
    } catch (error) {
      console.error('Failed to delete contract:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingContract(null)
    refetch()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingContract(null)
  }

  const handleFilterChange = (status: string | undefined) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'expired': return 'bg-yellow-100 text-yellow-700'
      case 'terminated': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성'
      case 'expired': return '만료'
      case 'terminated': return '해지'
      default: return '알 수 없음'
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {editingContract ? "계약 정보 수정" : "새 계약 등록"}
          </h1>
          <Button variant="outline" onClick={handleFormCancel}>
            목록으로 돌아가기
          </Button>
        </div>
        
        <ContractForm
          initialData={editingContract ? {
            ...editingContract,
            startDate: new Date(editingContract.startDate),
            endDate: new Date(editingContract.endDate)
          } : undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">계약 관리</h1>
          <p className="text-gray-600 mt-1">등록된 임대계약 정보를 관리할 수 있습니다.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 계약 등록
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>계약 상태 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(undefined)}
            >
              전체
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("active")}
            >
              활성 계약
            </Button>
            <Button
              variant={statusFilter === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("expired")}
            >
              만료된 계약
            </Button>
            <Button
              variant={statusFilter === "terminated" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("terminated")}
            >
              해지된 계약
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          총 {total}개의 계약 ({currentPage}/{totalPages} 페이지)
        </p>
      </div>

      {/* Contract List */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">계약 정보를 불러오는 중...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch}>다시 시도</Button>
          </CardContent>
        </Card>
      ) : contracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">등록된 계약이 없습니다.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 계약 등록하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => {
            const daysRemaining = getDaysRemaining(contract.endDate)
            const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0
            
            return (
              <Card key={contract.id} className={`hover:shadow-md transition-shadow ${
                isExpiringSoon ? 'border-yellow-300 bg-yellow-50' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold">계약 #{contract.id}</h3>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(contract.status)}`}>
                          {getStatusText(contract.status)}
                        </span>
                        {isExpiringSoon && (
                          <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-full">
                            만료 임박 ({daysRemaining}일 남음)
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 기본 정보 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">고객:</span>
                            <span>{contract.customer.name}</span>
                            <span className="text-gray-500">({contract.customer.phone})</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Home className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">방:</span>
                            <span>{contract.room.roomNumber}호</span>
                            <span className="text-gray-500">({contract.room.roomType}, {contract.room.area}㎡)</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">계약기간:</span>
                            <span>
                              {new Date(contract.startDate).toLocaleDateString('ko-KR')} ~ 
                              {new Date(contract.endDate).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        </div>
                        
                        {/* 금액 정보 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">월세:</span>
                            <span className="text-lg font-semibold text-blue-600">
                              {formatCurrency(contract.monthlyRent)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium ml-6">보증금:</span>
                            <span className="font-medium">
                              {formatCurrency(contract.deposit)}
                            </span>
                          </div>
                          
                          {contract.managementFee && contract.managementFee > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium ml-6">관리비:</span>
                              <span>{formatCurrency(contract.managementFee)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm pt-2 border-t">
                            <span className="font-medium ml-6">월 총액:</span>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(contract.monthlyRent + (contract.managementFee || 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {contract.note && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                              <span className="font-medium">메모:</span>
                              <p className="text-gray-600 mt-1">{contract.note}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                        계약일: {new Date(contract.createdAt).toLocaleDateString('ko-KR')}
                        {contract.updatedAt !== contract.createdAt && (
                          <span className="ml-4">
                            수정일: {new Date(contract.updatedAt).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contract)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            이전
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            다음
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>계약 삭제 확인</CardTitle>
              <CardDescription>
                이 계약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deleteContract.loading}
                >
                  {deleteContract.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    '삭제'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}