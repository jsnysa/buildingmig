import { useState } from "react"
import { CustomerForm } from "../components/forms/CustomerForm"
import { ContractForm } from "../components/forms/ContractForm"
import { type CustomerFormData, type ContractFormData } from "../lib/validations"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { DatePicker, DateRangePicker } from "../components/ui/datepicker"
import { Input, PhoneInput, CurrencyInput, BusinessNumberInput } from "../components/ui/input"

export function FormDemo() {
  const [currentDemo, setCurrentDemo] = useState<'inputs' | 'customer' | 'contract'>('inputs')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})

  const handleCustomerSubmit = async (data: CustomerFormData) => {
    console.log('Customer Form Data:', data)
    alert('고객 정보가 성공적으로 저장되었습니다!')
  }

  const handleContractSubmit = async (data: ContractFormData) => {
    console.log('Contract Form Data:', data)
    alert('계약 정보가 성공적으로 저장되었습니다!')
  }

  return (
    <div className="space-y-6">
      {/* 데모 선택 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>폼 컴포넌트 데모</CardTitle>
          <CardDescription>
            React Hook Form, IMask, Zod를 사용한 고급 폼 컴포넌트들을 확인해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Button
              variant={currentDemo === 'inputs' ? 'default' : 'outline'}
              onClick={() => setCurrentDemo('inputs')}
            >
              Input 컴포넌트
            </Button>
            <Button
              variant={currentDemo === 'customer' ? 'default' : 'outline'}
              onClick={() => setCurrentDemo('customer')}
            >
              고객 등록 폼
            </Button>
            <Button
              variant={currentDemo === 'contract' ? 'default' : 'outline'}
              onClick={() => setCurrentDemo('contract')}
            >
              계약 등록 폼
            </Button>
          </div>

          {currentDemo === 'inputs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Enhanced Input Components</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">기본 Input</label>
                    <Input placeholder="텍스트를 입력하세요" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">전화번호 Input (Masked)</label>
                    <PhoneInput />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">통화 Input (Number Only)</label>
                    <CurrencyInput />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">사업자등록번호 Input</label>
                    <BusinessNumberInput />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">날짜 선택기</label>
                    <DatePicker
                      date={selectedDate}
                      onDateChange={setSelectedDate}
                      placeholder="날짜를 선택하세요"
                    />
                    {selectedDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        선택된 날짜: {selectedDate.toLocaleDateString('ko-KR')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">날짜 범위 선택기</label>
                    <DateRangePicker
                      from={dateRange.from}
                      to={dateRange.to}
                      onRangeChange={setDateRange}
                      placeholder="날짜 범위를 선택하세요"
                    />
                    {dateRange.from && (
                      <p className="text-sm text-gray-600 mt-1">
                        시작: {dateRange.from.toLocaleDateString('ko-KR')}
                        {dateRange.to && ` ~ 종료: ${dateRange.to.toLocaleDateString('ko-KR')}`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">커스텀 마스크 Input</label>
                    <Input
                      mask="AAA-000-AAA"
                      placeholder="ABC-123-XYZ"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A: 알파벳, 0: 숫자 패턴
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">기능 설명</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>IMask 통합:</strong> 자동 포맷팅과 입력 제한</li>
                  <li>• <strong>React DayPicker:</strong> 한국어 달력과 날짜 범위 선택</li>
                  <li>• <strong>TypeScript 지원:</strong> 완전한 타입 안정성</li>
                  <li>• <strong>접근성:</strong> 키보드 네비게이션과 스크린 리더 지원</li>
                  <li>• <strong>반응형 디자인:</strong> 모든 화면 크기에서 최적화</li>
                </ul>
              </div>
            </div>
          )}

          {currentDemo === 'customer' && (
            <CustomerForm
              onSubmit={handleCustomerSubmit}
              onCancel={() => console.log('Customer form cancelled')}
            />
          )}

          {currentDemo === 'contract' && (
            <ContractForm
              onSubmit={handleContractSubmit}
              onCancel={() => console.log('Contract form cancelled')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}