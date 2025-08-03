import { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
  userRole?: 'admin' | 'user' | 'spend'
}

export function Layout({ children, userRole = 'user' }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    // 실제 로그아웃 로직 구현
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} userRole={userRole} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}