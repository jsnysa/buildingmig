import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { BarChart3, LogOut, Menu } from "lucide-react"

interface HeaderProps {
  onMenuToggle: () => void
  onLogout: () => void
}

export function Header({ onMenuToggle, onLogout }: HeaderProps) {
  const handleLogout = () => {
    if (confirm('로그아웃하시겠습니까?')) {
      onLogout()
    }
  }

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <nav className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">건물관리시스템</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <BarChart3 className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  )
}