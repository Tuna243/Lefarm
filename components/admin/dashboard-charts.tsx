"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { useState, useEffect } from "react"

const CATEGORY_COLORS: Record<string, string> = {
  vegetables: "var(--chart-1)",
  fruits: "var(--chart-2)",
  grains: "var(--chart-3)",
  organic: "var(--chart-4)",
}

const CATEGORY_NAMES: Record<string, string> = {
  vegetables: "Rau củ",
  fruits: "Trái cây",
  grains: "Ngũ cốc",
  organic: "Hữu cơ",
}

export function CategoryChart() {
  const [categoryData, setCategoryData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const products = await response.json()
          
          // Count products by category
          const categoryCounts: Record<string, number> = {}
          products.forEach((product: any) => {
            const category = product.category || 'other'
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
          })

          const totalProducts = products.length
          setTotal(totalProducts)

          // Convert to chart data format
          const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
            name: CATEGORY_NAMES[category] || category,
            value: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0,
            count: count,
            color: CATEGORY_COLORS[category] || "var(--chart-5)",
          }))

          setCategoryData(chartData)
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm theo danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm theo danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Chưa có sản phẩm</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: any, name: any, props: any) => [
                  `${props.payload.count} sản phẩm (${value}%)`,
                  props.payload.name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivityChart() {
  const [activityData, setActivityData] = useState<Array<{ month: string; visits: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/visits?type=monthly&months=6')
        const data = await response.json()
        setActivityData(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        // Fallback to empty data
        setActivityData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Truy cập trang web theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          ) : activityData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Chưa có dữ liệu truy cập</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="visits" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
