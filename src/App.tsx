import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Contract } from './pages/Contract'
import { FormDemo } from './pages/FormDemo'
import { Customers } from './pages/Customers'
import { Rooms } from './pages/Rooms'
import { Contracts } from './pages/Contracts'
import { useAuth } from './hooks/useAuth'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Loader2 } from 'lucide-react'

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">로그인 상태를 확인 중...</span>
      </div>
    )
  }

  // 사용자 역할 결정 (임시 로직, 실제로는 user.role 사용)
  const userRole = (user?.role as 'admin' | 'user' | 'spend') || 'user'

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/*" element={
        isAuthenticated ? (
          <Layout userRole={userRole}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contract" element={<Contract />} />
              <Route path="/form-demo" element={<FormDemo />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/branch" element={<div className="p-4">지점정보 페이지 (구현 예정)</div>} />
              <Route path="/room" element={<div className="p-4">방정보 페이지 (구현 예정)</div>} />
              <Route path="/customer" element={<div className="p-4">고객 페이지 (구현 예정)</div>} />
              <Route path="/coming-contract" element={<div className="p-4">만기도래계약 페이지 (구현 예정)</div>} />
              <Route path="/sms-template" element={<div className="p-4">SMS 유형 페이지 (구현 예정)</div>} />
              <Route path="/sms-send" element={<div className="p-4">SMS 발송 페이지 (구현 예정)</div>} />
              <Route path="/calendar-std" element={<div className="p-4">일정기준 페이지 (구현 예정)</div>} />
              <Route path="/building" element={<div className="p-4">건물 페이지 (구현 예정)</div>} />
              <Route path="*" element={<div className="p-4">페이지를 찾을 수 없습니다.</div>} />
            </Routes>
          </Layout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App
