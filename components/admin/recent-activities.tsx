'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: string
  action: string
  description: string
  time: string
  type: "product" | "contact" | "lead" | "alert" | "news"
  timestamp: Date
}

const typeColors: Record<string, string> = {
  product: "bg-primary/10 text-primary",
  contact: "bg-chart-2/20 text-chart-2",
  lead: "bg-chart-3/20 text-chart-3",
  news: "bg-chart-4/20 text-chart-4",
  alert: "bg-destructive/10 text-destructive-foreground",
}

const typeLabels: Record<string, string> = {
  product: "Sản phẩm",
  contact: "Liên hệ",
  lead: "Yêu cầu",
  news: "Tin tức",
  alert: "Cảnh báo",
}

// Helper function to format relative time without date-fns
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'vừa xong'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} tuần trước`
  return `${Math.floor(seconds / 2592000)} tháng trước`
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const [leadsRes, productsRes, contactsRes, newsRes] = await Promise.all([
          fetch('/api/leads?limit=10'),
          fetch('/api/products'),
          fetch('/api/contacts'),
          fetch('/api/news'),
        ])

        const leads = await leadsRes.json()
        const products = await productsRes.json()
        const contacts = await contactsRes.json()
        const news = await newsRes.json()

        // Convert to activities and sort by most recent
        const allActivities: Activity[] = []

        // Add lead activities (most important - contact requests)
        if (Array.isArray(leads)) {
          leads.slice(0, 10).forEach((lead: any) => {
            allActivities.push({
              id: `lead-${lead.id}`,
              action: 'Yêu cầu liên hệ mới',
              description: `${lead.name} - ${lead.subject}`,
              time: '',
              type: 'lead',
              timestamp: new Date(lead.createdAt),
            })
          })
        }

        // Add news activities (published articles)
        if (Array.isArray(news)) {
          news.slice(0, 5).forEach((article: any) => {
            if (article.status === 'published') {
              allActivities.push({
                id: `news-${article.id}`,
                action: article.publishedAt ? 'Bài viết được đăng' : 'Bài viết mới',
                description: article.title,
                time: '',
                type: 'news',
                timestamp: new Date(article.publishedAt || article.createdAt),
              })
            }
          })
        }

        // Add product activities (recent products)
        if (Array.isArray(products)) {
          products.slice(0, 5).forEach((product: any) => {
            allActivities.push({
              id: `product-${product.id}`,
              action: 'Sản phẩm được cập nhật',
              description: product.nameVi,
              time: '',
              type: 'product',
              timestamp: new Date(product.updatedAt),
            })
          })
        }

        // Add contact activities (low priority)
        if (Array.isArray(contacts)) {
          contacts.slice(0, 3).forEach((contact: any) => {
            const actionMap: Record<string, string> = {
              'phone': 'Cập nhật số điện thoại',
              'email': 'Cập nhật email',
              'address': 'Cập nhật địa chỉ',
              'zalo': 'Cập nhật Zalo',
            }
            allActivities.push({
              id: `contact-${contact.id}`,
              action: actionMap[contact.type] || 'Cập nhật liên hệ',
              description: contact.value,
              time: '',
              type: 'contact',
              timestamp: new Date(contact.updatedAt),
            })
          })
        }

        // Sort by timestamp (newest first)
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

        // Format time strings and take top 10
        const formattedActivities = allActivities.slice(0, 10).map(activity => ({
          ...activity,
          time: formatRelativeTime(activity.timestamp),
        }))

        setActivities(formattedActivities)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()

    // Refresh every 30 seconds
    const interval = setInterval(fetchActivities, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Chưa có hoạt động nào</div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Badge className={typeColors[activity.type]} variant="secondary">
                  {typeLabels[activity.type] || activity.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
