import { useState } from "react"
import { useRooms, useDeleteRoom } from "../hooks/useRooms"
import { RoomForm } from "../components/forms/RoomForm"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, Edit, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import { type Room } from "../lib/api"
import { formatCurrency } from "../lib/utils"

export function Rooms() {
  const [currentPage, setCurrentPage] = useState(1)
  const [availableFilter, setAvailableFilter] = useState<boolean | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const { data: roomsData, loading, error, refetch } = useRooms(currentPage, 12, availableFilter)
  const deleteRoom = useDeleteRoom()

  const rooms = roomsData?.data?.rooms || []
  const totalPages = roomsData?.data?.totalPages || 1
  const total = roomsData?.data?.total || 0

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom.mutate(id)
      setShowDeleteConfirm(null)
      refetch()
    } catch (error) {
      console.error('Failed to delete room:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingRoom(null)
    refetch()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingRoom(null)
  }

  const handleFilterChange = (available: boolean | undefined) => {
    setAvailableFilter(available)
    setCurrentPage(1)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {editingRoom ? "방 정보 수정" : "새 방 등록"}
          </h1>
          <Button variant="outline" onClick={handleFormCancel}>
            목록으로 돌아가기
          </Button>
        </div>
        
        <RoomForm
          initialData={editingRoom || undefined}
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
          <h1 className="text-3xl font-bold">방 관리</h1>
          <p className="text-gray-600 mt-1">등록된 방 정보를 관리할 수 있습니다.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 방 등록
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>필터 및 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={availableFilter === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(undefined)}
              >
                전체
              </Button>
              <Button
                variant={availableFilter === true ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(true)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                입주 가능
              </Button>
              <Button
                variant={availableFilter === false ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(false)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                입주 중
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          총 {total}개의 방 ({currentPage}/{totalPages} 페이지)
        </p>
      </div>

      {/* Room Grid */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">방 정보를 불러오는 중...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch}>다시 시도</Button>
          </CardContent>
        </Card>
      ) : rooms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">등록된 방이 없습니다.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 방 등록하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{room.roomNumber}호</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {room.isAvailable ? '입주 가능' : '입주 중'}
                    </span>
                  </div>
                </div>
                <CardDescription>{room.roomType} • {room.area}㎡ • {room.floor}층</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 금액 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">월세</span>
                    <span className="font-semibold text-lg">{formatCurrency(room.monthlyRent)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">보증금</span>
                    <span className="font-medium">{formatCurrency(room.deposit)}</span>
                  </div>
                  {room.managementFee && room.managementFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">관리비</span>
                      <span className="text-sm">{formatCurrency(room.managementFee)}</span>
                    </div>
                  )}
                </div>

                {/* 편의시설 */}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">편의시설</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{room.amenities.length - 3}개
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 설명 */}
                {room.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">설명</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{room.description}</p>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(room)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(room.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* 등록일 */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                  등록일: {new Date(room.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          ))}
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
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          })}
          
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
              <CardTitle>방 삭제 확인</CardTitle>
              <CardDescription>
                이 방을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
                  disabled={deleteRoom.loading}
                >
                  {deleteRoom.loading ? (
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