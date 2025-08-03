import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { 
  ChevronDown, 
  ChevronRight,
  BookOpen, 
  Home,
  Bell,
  DollarSign,
  Edit,
  Briefcase
} from "lucide-react"
import { cn } from "../../lib/utils"

interface SidebarProps {
  isOpen: boolean
  userRole: 'admin' | 'user' | 'spend'
}

interface MenuItem {
  id: string
  title: string
  icon: React.ReactNode
  items?: { id: string; title: string; href: string; badge?: string }[]
  roles?: string[]
}

const menuItems: MenuItem[] = [
  {
    id: 'management',
    title: '관리 목록',
    icon: <BookOpen className="h-4 w-4" />,
    roles: ['admin', 'user'],
    items: [
      { id: 'branch', title: '지점정보', href: '/branch' },
      { id: 'rooms', title: '방 관리', href: '/rooms' },
      { id: 'customers', title: '고객 관리', href: '/customers' },
      { id: 'contracts', title: '계약 관리', href: '/contracts' },
      { id: 'contract', title: '계약정보', href: '/contract' },
      { id: 'coming-contract', title: '만기도래계약', href: '/coming-contract', badge: 'update' },
      { id: 'inout-amt', title: '입퇴출납', href: '/inout-amt', badge: 'new' },
      { id: 'inout-schedule', title: '입퇴일정', href: '/inout-schedule', badge: 'new' },
      { id: 'partner', title: '파트너', href: '/partner' },
      { id: 'calculate', title: '비용처리', href: '/calculate', badge: 'new' },
      { id: 'payment', title: '납부정보', href: '/payment' },
      { id: 'rent-home', title: '임대계약신고', href: '/rent-home', badge: 'new' },
      { id: 'status-graph', title: '현황(그래프)', href: '/status-graph', badge: 'update' },
      { id: 'status-list', title: '현황(목록)', href: '/status-list', badge: 'new' },
      { id: 'work-log', title: '작업일지', href: '/work-log', badge: 'new' },
    ]
  },
  {
    id: 'messages',
    title: '메세지',
    icon: <Bell className="h-4 w-4" />,
    roles: ['admin', 'user'],
    items: [
      { id: 'sms-template', title: 'SMS 유형', href: '/sms-template' },
      { id: 'sms-send', title: 'SMS 발송', href: '/sms-send' },
      { id: 'sms-list', title: 'SMS 발송목록', href: '/sms-list' },
      { id: 'repay-msg', title: '정산메세지', href: '/repay-msg', badge: 'new' },
      { id: 'report-msg', title: '월간보고', href: '/report-msg', badge: 'new' },
    ]
  },
  {
    id: 'home',
    title: '홈 목록',
    icon: <Home className="h-4 w-4" />,
    roles: ['admin', 'user'],
    items: [
      { id: 'calendar-std', title: '일정기준', href: '/calendar-std' },
      { id: 'calendar-mng', title: '일정관리', href: '/calendar-mng' },
      { id: 'building', title: '건물', href: '/building', badge: 'new' },
      { id: 'saving', title: '보험적금', href: '/saving' },
      { id: 'loan', title: '대출', href: '/loan' },
      { id: 'bankbook', title: '통장관리', href: '/bankbook', badge: 'new' },
      { id: 'transfer', title: '이체관리', href: '/transfer', badge: 'new' },
      { id: 'todo', title: 'TODO계획', href: '/todo', badge: 'new' },
    ]
  },
  {
    id: 'spend',
    title: '지출관리',
    icon: <DollarSign className="h-4 w-4" />,
    roles: ['spend'],
    items: [
      { id: 'spend-item', title: '지출과목', href: '/spend-item' },
      { id: 'spend-std', title: '지출계획', href: '/spend-std' },
      { id: 'spend-pay', title: '지출관리', href: '/spend-pay' },
    ]
  },
  {
    id: 'wiki',
    title: '위키',
    icon: <Edit className="h-4 w-4" />,
    roles: ['admin'],
    items: [
      { id: 'wiki-category', title: '카테고리', href: '/wiki-category' },
      { id: 'wiki-list', title: '위키목록', href: '/wiki-list' },
    ]
  },
  {
    id: 'work',
    title: '작업',
    icon: <Briefcase className="h-4 w-4" />,
    roles: ['admin'],
    items: [
      { id: 'work-project', title: '프로젝트', href: '/work-project' },
      { id: 'work-order', title: '주문', href: '/work-order' },
    ]
  },
]

export function Sidebar({ isOpen, userRole }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  )

  return (
    <aside className={cn(
      "bg-slate-900 text-white h-full transition-all duration-300 flex flex-col",
      isOpen ? "w-64" : "w-0 overflow-hidden"
    )}>
      {isOpen && (
        <>
          {/* User Panel */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">AP</span>
              </div>
              <div>
                <p className="font-medium">Alexander Pierce</p>
                <p className="text-sm text-slate-400">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700">
            <Input
              type="text"
              placeholder="Search..."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                MAIN NAVIGATION
              </h3>
              
              <ul className="space-y-1">
                {filteredMenuItems.map((item) => (
                  <li key={item.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-white hover:bg-slate-800 p-2 h-auto"
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.items && (
                        expandedItems.includes(item.id) 
                          ? <ChevronDown className="h-4 w-4" />
                          : <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {item.items && expandedItems.includes(item.id) && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <li key={subItem.id}>
                            <Button
                              variant="ghost"
                              asChild
                              className="w-full justify-start text-left text-slate-300 hover:bg-slate-800 hover:text-white py-1.5 px-2 h-auto"
                            >
                              <Link to={subItem.href} className="flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                <span className="flex-1">{subItem.title}</span>
                                {subItem.badge && (
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full ml-2",
                                    subItem.badge === 'new' && "bg-green-600 text-white",
                                    subItem.badge === 'update' && "bg-blue-600 text-white"
                                  )}>
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </>
      )}
    </aside>
  )
}