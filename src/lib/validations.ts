import { z } from "zod"

// 공통 유효성 검증 스키마들
export const phoneSchema = z.string()
  .min(1, "전화번호를 입력해주세요")
  .regex(/^\d{3}-\d{4}-\d{4}$/, "올바른 전화번호 형식으로 입력해주세요 (예: 010-1234-5678)")

export const emailSchema = z.string()
  .min(1, "이메일을 입력해주세요")
  .email("올바른 이메일 형식으로 입력해주세요")

export const businessNumberSchema = z.string()
  .min(1, "사업자등록번호를 입력해주세요")
  .regex(/^\d{3}-\d{2}-\d{5}$/, "올바른 사업자등록번호 형식으로 입력해주세요 (예: 123-45-67890)")

export const currencySchema = z.number()
  .min(0, "금액은 0 이상이어야 합니다")
  .max(999999999999, "금액이 너무 큽니다")

export const dateSchema = z.date().refine((date) => date !== undefined, {
  message: "날짜를 선택해주세요"
})

export const requiredStringSchema = (fieldName: string) => 
  z.string().min(1, `${fieldName}을(를) 입력해주세요`)

export const optionalStringSchema = z.string().optional()

// 로그인 폼 스키마
export const loginSchema = z.object({
  userId: requiredStringSchema("사용자 ID"),
  password: requiredStringSchema("비밀번호"),
  remember: z.boolean().optional()
})

export type LoginFormData = z.infer<typeof loginSchema>

// 고객 등록/수정 폼 스키마
export const customerSchema = z.object({
  name: requiredStringSchema("고객명")
    .min(2, "고객명은 최소 2글자 이상이어야 합니다")
    .max(50, "고객명은 최대 50글자까지 가능합니다"),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  address: requiredStringSchema("주소"),
  detailAddress: optionalStringSchema,
  businessNumber: businessNumberSchema.optional().or(z.literal("")),
  note: optionalStringSchema
})

export type CustomerFormData = z.infer<typeof customerSchema>

// 계약 등록/수정 폼 스키마
export const contractSchema = z.object({
  customerId: z.number().min(1, "고객을 선택해주세요"),
  roomId: z.number().min(1, "방을 선택해주세요"),
  startDate: dateSchema,
  endDate: dateSchema,
  monthlyRent: currencySchema,
  deposit: currencySchema,
  managementFee: currencySchema.optional(),
  note: optionalStringSchema
}).refine((data) => data.endDate > data.startDate, {
  message: "종료일은 시작일보다 늦어야 합니다",
  path: ["endDate"]
})

export type ContractFormData = z.infer<typeof contractSchema>

// 방 등록/수정 폼 스키마
export const roomSchema = z.object({
  roomNumber: requiredStringSchema("방 번호")
    .max(10, "방 번호는 최대 10글자까지 가능합니다"),
  floor: z.number()
    .min(1, "층수는 1 이상이어야 합니다")
    .max(100, "층수는 100 이하여야 합니다"),
  roomType: requiredStringSchema("방 유형"),
  area: z.number()
    .min(1, "면적은 1㎡ 이상이어야 합니다")
    .max(1000, "면적은 1000㎡ 이하여야 합니다"),
  monthlyRent: currencySchema,
  deposit: currencySchema,
  managementFee: currencySchema.optional(),
  description: optionalStringSchema,
  amenities: z.array(z.string()).optional()
})

export type RoomFormData = z.infer<typeof roomSchema>

// 지점 등록/수정 폼 스키마
export const branchSchema = z.object({
  name: requiredStringSchema("지점명")
    .min(2, "지점명은 최소 2글자 이상이어야 합니다")
    .max(50, "지점명은 최대 50글자까지 가능합니다"),
  code: requiredStringSchema("지점 코드")
    .min(2, "지점 코드는 최소 2글자 이상이어야 합니다")
    .max(10, "지점 코드는 최대 10글자까지 가능합니다"),
  address: requiredStringSchema("주소"),
  phone: phoneSchema,
  managerName: requiredStringSchema("관리자명"),
  managerPhone: phoneSchema,
  description: optionalStringSchema
})

export type BranchFormData = z.infer<typeof branchSchema>

// 납부 등록/수정 폼 스키마
export const paymentSchema = z.object({
  contractId: z.number().min(1, "계약을 선택해주세요"),
  paymentDate: dateSchema,
  amount: currencySchema,
  paymentType: requiredStringSchema("납부 유형"),
  paymentMethod: requiredStringSchema("납부 방법"),
  note: optionalStringSchema
})

export type PaymentFormData = z.infer<typeof paymentSchema>

// 일정 등록/수정 폼 스키마
export const scheduleSchema = z.object({
  title: requiredStringSchema("제목")
    .max(100, "제목은 최대 100글자까지 가능합니다"),
  description: optionalStringSchema,
  startDate: dateSchema,
  endDate: dateSchema,
  isAllDay: z.boolean().optional(),
  category: requiredStringSchema("카테고리"),
  priority: z.enum(["low", "medium", "high"]).optional()
}).refine((data) => data.endDate >= data.startDate, {
  message: "종료일은 시작일보다 늦거나 같아야 합니다",
  path: ["endDate"]
})

export type ScheduleFormData = z.infer<typeof scheduleSchema>