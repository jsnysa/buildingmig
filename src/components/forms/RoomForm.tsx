import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { roomSchema, type RoomFormData } from "../../lib/validations"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input, CurrencyInput } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Loader2, X } from "lucide-react"
import { useCreateRoom, useUpdateRoom } from "../../hooks/useRooms"
import { useState } from "react"

interface RoomFormProps {
  initialData?: Partial<RoomFormData & { id?: number }>
  onSubmit?: (data: RoomFormData) => Promise<void> | void
  onCancel?: () => void
  onSuccess?: () => void
  isLoading?: boolean
}

export function RoomForm({ initialData, onSubmit, onCancel, onSuccess, isLoading }: RoomFormProps) {
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || [])
  const [newAmenity, setNewAmenity] = useState("")

  // API hooks
  const createRoom = useCreateRoom()
  const updateRoom = useUpdateRoom()
  
  const isSubmitting = createRoom.loading || updateRoom.loading

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: initialData?.roomNumber || "",
      floor: initialData?.floor || 1,
      roomType: initialData?.roomType || "",
      area: initialData?.area || 0,
      monthlyRent: initialData?.monthlyRent || 0,
      deposit: initialData?.deposit || 0,
      managementFee: initialData?.managementFee || 0,
      description: initialData?.description || "",
      amenities: initialData?.amenities || [],
    },
  })

  const handleSubmit = async (data: RoomFormData) => {
    try {
      const formData = { ...data, amenities }
      
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        if (initialData?.id) {
          await updateRoom.mutate({ id: initialData.id, data: formData })
        } else {
          await createRoom.mutate(formData)
        }
        onSuccess?.()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAmenity()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "방 정보 수정" : "새 방 등록"}</CardTitle>
        <CardDescription>
          방의 상세 정보를 입력해주세요. 모든 필수 항목을 입력해야 합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Error messages */}
            {(createRoom.error || updateRoom.error) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {createRoom.error || updateRoom.error}
                </p>
              </div>
            )}

            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>방 번호 *</FormLabel>
                      <FormControl>
                        <Input placeholder="101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>층수 *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>방 유형 *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          {...field}
                        >
                          <option value="">방 유형을 선택하세요</option>
                          <option value="원룸">원룸</option>
                          <option value="투룸">투룸</option>
                          <option value="쓰리룸">쓰리룸</option>
                          <option value="오피스텔">오피스텔</option>
                          <option value="기타">기타</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>면적 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="1000"
                        placeholder="25.5"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>단위: ㎡ (제곱미터)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            {/* 편의시설 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">편의시설</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="편의시설을 입력하세요 (예: 에어컨, 냉장고, 세탁기)"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={addAmenity}>
                    추가
                  </Button>
                </div>
                
                {amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="hover:bg-blue-200 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 추가 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">추가 정보</h3>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="방에 대한 상세 설명을 입력하세요..."
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
                  initialData ? "수정 완료" : "방 등록"
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
      </CardContent>
    </Card>
  )
}