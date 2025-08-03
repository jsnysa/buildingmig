import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart3, DollarSign, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { formatCurrency } from "../lib/utils"

interface DashboardData {
  totalContracts: number
  monthlyRevenue: number
  expiringContracts: number
  vacancyRate: string
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalContracts: 0,
    monthlyRevenue: 0,
    expiringContracts: 0,
    vacancyRate: '0%'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setData({
          totalContracts: 127,
          monthlyRevenue: 128500000,
          expiringContracts: 6,
          vacancyRate: '10%'
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const stats = [
    {
      title: '전체 계약',
      value: loading ? '...' : data.totalContracts.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '이번달 수익',
      value: loading ? '...' : formatCurrency(data.monthlyRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '만료 예정',
      value: loading ? '...' : data.expiringContracts.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: '공실률',
      value: loading ? '...' : data.vacancyRate,
      icon: BarChart3,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const activities = [
    {
      id: 1,
      type: 'success',
      message: '새로운 계약이 체결되었습니다',
      time: '2시간 전',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'info',
      message: '납부정보가 업데이트되었습니다',
      time: '5시간 전',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'warning',
      message: '계약 만료 예정 알림',
      time: '1일 전',
      icon: Clock,
      color: 'text-yellow-600'
    }
  ]

  const contractStatus = [
    { label: '활성 계약', count: 117, color: 'bg-green-500' },
    { label: '만료 예정', count: 8, color: 'bg-yellow-500' },
    { label: '만료됨', count: 0, color: 'bg-red-500' },
    { label: '공실', count: 15, color: 'bg-gray-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">대시보드</CardTitle>
          <CardDescription>
            건물관리시스템 현황을 한눈에 확인하세요
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${stat.bgColor} rounded-md flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg font-medium text-foreground">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>월별 수익 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">차트가 여기에 표시됩니다</p>
                <p className="text-sm text-muted-foreground mt-1">Chart.js 연동 예정</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Status */}
        <Card>
          <CardHeader>
            <CardTitle>계약 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractStatus.map((status) => (
                <div key={status.label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${status.color} rounded-full mr-3`} />
                    <span className="text-sm text-muted-foreground">{status.label}</span>
                  </div>
                  <span className="text-sm font-medium">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => {
                const IconComponent = activity.icon
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full bg-background ring-8 ring-background flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 ${activity.color}`} />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {activity.message}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-muted-foreground">
                            <time>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}