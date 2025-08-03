import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { customerSchema, type CustomerFormData } from "../../lib/validations"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input, PhoneInput, BusinessNumberInput } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Loader2 } from "lucide-react"
import { useCreateCustomer, useUpdateCustomer } from "../../hooks/useCustomers"

interface CustomerFormProps {
  initialData?: Partial<CustomerFormData & { id?: number }>
  onSubmit?: (data: CustomerFormData) => Promise<void> | void
  onCancel?: () => void
  onSuccess?: () => void
  isLoading?: boolean
}

export function CustomerForm({ initialData, onSubmit, onCancel, onSuccess, isLoading }: CustomerFormProps) {
  // API hooks
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  
  const isSubmitting = createCustomer.loading || updateCustomer.loading

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      detailAddress: initialData?.detailAddress || "",
      businessNumber: initialData?.businessNumber || "",
      note: initialData?.note || "",
    },
  })

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      if (onSubmit) {
        // 사용자 정의 onSubmit이 있으면 사용
        await onSubmit(data)
      } else {
        // 기본 API 호출
        if (initialData?.id) {
          await updateCustomer.mutate({ id: initialData.id, data })
        } else {
          await createCustomer.mutate(data)
        }
        onSuccess?.()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "고객 정보 수정" : "새 고객 등록"}</CardTitle>
        <CardDescription>
          고객의 기본 정보를 입력해주세요. 필수 항목은 반드시 입력해야 합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Error messages */}
            {(createCustomer.error || updateCustomer.error) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {createCustomer.error || updateCustomer.error}
                </p>
              </div>
            )}
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">기본 정보</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>고객명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호 *</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="example@email.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        계약서나 공지사항 발송에 사용됩니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 주소 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">주소 정보</h3>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>주소 *</FormLabel>
                    <FormControl>
                      <Input placeholder="서울시 강남구 역삼동 123-45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상세 주소</FormLabel>
                    <FormControl>
                      <Input placeholder="101동 102호" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 추가 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">추가 정보</h3>
              
              <FormField
                control={form.control}
                name="businessNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사업자등록번호</FormLabel>
                    <FormControl>
                      <BusinessNumberInput {...field} />
                    </FormControl>
                    <FormDescription>
                      법인 고객인 경우 입력해주세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>메모</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="고객에 대한 추가 메모사항을 입력하세요..."
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
                  initialData ? "수정 완료" : "등록하기"
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