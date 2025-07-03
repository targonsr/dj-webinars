import { 
  mockDashboardStats, 
  mockQuickActions, 
  mockRecentRequests, 
  mockMetrics, 
  mockRoutePerformance 
} from '~/model/dashboard/dashboard.mocks'
import type { 
  DashboardStat, 
  QuickAction, 
  RecentRequest, 
  Metrics, 
  RoutePerformance 
} from '~/model/dashboard'

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStat[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDashboardStats
  },

  async getQuickActions(): Promise<QuickAction[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockQuickActions
  },

  async getRecentRequests(): Promise<RecentRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockRecentRequests
  },

  async getMetrics(): Promise<Metrics> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockMetrics
  },

  async getRoutePerformance(): Promise<RoutePerformance[]> {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockRoutePerformance
  },

  async generateReports(dateRange: { from: string; to: string }) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Generating reports for date range:', dateRange)
    return { success: true }
  },

  async exportReport(format: string) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Exporting report in ${format} format`)
    return { success: true }
  }
}