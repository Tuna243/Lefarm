'use client'

import { useEffect, useState } from 'react'
import { Package, Users, Mail, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import { RecentActivities } from '@/components/admin/recent-activities'
import { CategoryChart, ActivityChart } from '@/components/admin/dashboard-charts'

interface Stats {
  products: number
  projects: number
  leads: number
  contacts: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    projects: 0,
    leads: 0,
    contacts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, projectsRes, leadsRes, contactsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/projects'),
          fetch('/api/leads'),
          fetch('/api/contacts'),
        ])

        const products = await productsRes.json()
        const projects = await projectsRes.json()
        const leads = await leadsRes.json()
        const contacts = await contactsRes.json()

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          leads: Array.isArray(leads) ? leads.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Keep default values (0) on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Chào mừng! Đây là thông tin về dự án của bạn.</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Sản phẩm" 
            value={(stats.products || 0).toString()} 
            icon={Package} 
            trend={{ value: 0, isPositive: true }} 
          />
          <StatsCard 
            title="Dự án" 
            value={(stats.projects || 0).toString()} 
            icon={Users} 
            trend={{ value: 0, isPositive: true }} 
          />
          <StatsCard 
            title="Liên hệ" 
            value={(stats.leads || 0).toString()} 
            icon={Mail} 
            description={`${stats.leads || 0} yêu cầu tư vấn`}
          />
          <StatsCard 
            title="Thông tin liên hệ" 
            value={(stats.contacts || 0).toString()} 
            icon={TrendingUp} 
            trend={{ value: 0, isPositive: true }} 
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart />
        <ActivityChart />
      </div>

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  )
}
