import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "../lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Building2, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function Login() {
  const navigate = useNavigate()
  const { login, loginLoading, loginError } = useAuth()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
      remember: false,
    },
  })

  // 저장된 로그인 정보 복원
  useEffect(() => {
    const savedData = localStorage.getItem('rememberLogin')
    if (savedData) {
      try {
        const remembered = JSON.parse(savedData)
        form.setValue('userId', remembered.userId || '')
        form.setValue('remember', true)
      } catch (error) {
        console.error('Failed to restore login data:', error)
      }
    }
  }, [form])

  const handleSubmit = async (data: LoginFormData) => {
    try {
      // 로그인 정보 저장/삭제
      if (data.remember) {
        const rememberData = {
          userId: data.userId
        }
        localStorage.setItem('rememberLogin', JSON.stringify(rememberData))
      } else {
        localStorage.removeItem('rememberLogin')
      }

      // 실제 로그인 API 호출
      const result = await login(data)
      
      // 성공 시 대시보드로 리다이렉트 (지연 처리)
      if (result && result.success) {
        setTimeout(() => {
          navigate('/dashboard')
        }, 100)
      }
    } catch (error) {
      console.error('Login failed:', error)
      // 에러는 useAuth hook에서 관리되어 화면에 표시됨
    }
  }

  return (
    <div key="login-page" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            건물관리시스템
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to start your session
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
            <p className="font-medium text-blue-800 mb-1">테스트 계정:</p>
            <p className="text-blue-600">관리자: admin / admin</p>
            <p className="text-blue-600">사용자: user / user</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">로그인</CardTitle>
            <CardDescription className="text-center">
              계정 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                
                {/* Login error display */}
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{loginError}</p>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사용자 ID</FormLabel>
                      <FormControl>
                        <Input placeholder="사용자 ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="비밀번호" 
                          autoFocus
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>로그인 정보 저장</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    '로그인'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}