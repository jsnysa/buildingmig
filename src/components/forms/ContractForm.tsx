import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contractSchema, type ContractFormData } from "../../lib/validations"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { CurrencyInput } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { DatePicker } from "../ui/datepicker"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "../../lib/utils"
import { useCustomers } from "../../hooks/useCustomers"
import { useRooms } from "../../hooks/useRooms"
import { useCreateContract, useUpdateContract } from "../../hooks/useContracts"
import { type Room } from "../../lib/api"

interface ContractFormProps {
  initialData?: Partial<ContractFormData & { id?: number }>
  onSubmit?: (data: ContractFormData) => Promise<void> | void
  onCancel?: () => void
  onSuccess?: () => void
  isLoading?: boolean
}

export function ContractForm({ initialData, onSubmit, onCancel, onSuccess, isLoading }: ContractFormProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  
  // API hooks
  const { data: customersData, loading: customersLoading } = useCustomers(1, 100)
  const { data: roomsData, loading: roomsLoading } = useRooms(1, 100, true) // Only available rooms
  const createContract = useCreateContract()
  const updateContract = useUpdateContract()
  
  const customers = customersData?.data?.customers || []
  const rooms = roomsData?.data?.rooms || []
  const isApiLoading = customersLoading || roomsLoading
  const isSubmitting = createContract.loading || updateContract.loading

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      customerId: initialData?.customerId || 0,
      roomId: initialData?.roomId || 0,
      startDate: initialData?.startDate || undefined,
      endDate: initialData?.endDate || undefined,
      monthlyRent: initialData?.monthlyRent || 0,
      deposit: initialData?.deposit || 0,
      managementFee: initialData?.managementFee || 0,
      note: initialData?.note || "",
    },
  })

  // 선택된 방 정보 감시
  const watchedRoomId = form.watch("roomId")

  useEffect(() => {
    if (watchedRoomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === watchedRoomId)
      if (room) {
        setSelectedRoom(room)
        // 방 선택 시 자동으로 금액 설정
        form.setValue("monthlyRent", room.monthlyRent)
        form.setValue("deposit", room.deposit)
        if (room.managementFee) {
          form.setValue("managementFee", room.managementFee)
        }
      }
    }
  }, [watchedRoomId, rooms, form])

  const handleSubmit = async (data: ContractFormData) => {
    try {
      if (onSubmit) {
        // 사용자 정의 onSubmit이 있으면 사용
        await onSubmit(data)
      } else {
        // 기본 API 호출
        if (initialData?.id) {
          await updateContract.mutate({ id: initialData.id, data })
        } else {
          await createContract.mutate(data)
        }
        onSuccess?.()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "계약 정보 수정" : "새 계약 등록"}</CardTitle>
        <CardDescription>
          임대 계약의 상세 정보를 입력해주세요. 모든 항목은 필수입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Loading state for API data */}
        {isApiLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">데이터를 불러오는 중...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Error messages */}
              {(createContract.error || updateContract.error) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    {createContract.error || updateContract.error}
                  </p>
                </div>
              )}
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>고객 *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          <option value={0}>고객을 선택하세요</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} ({customer.phone})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>방 *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          <option value={0}>방을 선택하세요</option>
                          {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.roomNumber}호 (월세: {formatCurrency(room.monthlyRent)})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedRoom && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">선택된 방 정보</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">방 번호:</span> {selectedRoom.roomNumber}호
                    </div>
                    <div>
                      <span className="text-blue-700">기본 월세:</span> {formatCurrency(selectedRoom.monthlyRent)}
                    </div>
                    <div>
                      <span className="text-blue-700">기본 보증금:</span> {formatCurrency(selectedRoom.deposit)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 계약 기간 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">계약 기간</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>계약 시작일 *</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="시작일을 선택하세요"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>계약 종료일 *</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="종료일을 선택하세요"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 금액 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">금액 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>월세 *</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>단위: 원</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>보증금 *</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>단위: 원</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="managementFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>관리비</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>단위: 원 (선택사항)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 추가 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">추가 정보</h3>
              
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>메모</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="계약에 대한 특이사항이나 메모를 입력하세요..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoading}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  initialData ? "수정 완료" : "계약 등록"
                )}
              </Button>
              
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                  className="flex-1"
                >
                  취소
                </Button>
              )}
            </div>
          </form>
        </Form>
        )}
      </CardContent>
    </Card>
  )
}