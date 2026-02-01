'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { ArrowRight } from 'lucide-react'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  image?: string
  category?: string
  results?: string
  year?: number
  createdAt: string
  updatedAt: string
}

export function ProjectsClient() {
  const { t } = useI18n()
  const [projects, setProjects] = useState<Project[]>([])
  const [category, setCategory] = useState('all')
  const [year, setYear] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = new URL('/api/projects', window.location.origin)
        if (category !== 'all') url.searchParams.append('category', category)
        if (year !== 'all') url.searchParams.append('year', year)

        const response = await fetch(url.toString())
        const data = await response.json()
        setProjects(data)

        // Extract unique categories and years for filters
        const uniqueCategories = [...new Set(data.map((p: Project) => p.category).filter(Boolean))] as string[]
        const uniqueYears = [...new Set(data.map((p: Project) => p.year).filter(Boolean))] as number[]
        setCategories(uniqueCategories.sort())
        setYears(uniqueYears.sort((a, b) => b - a))
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [category, year])

  return (
    <>
      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:items-center">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả năm</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="py-12 text-center">Đang tải dự án...</div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          Không có dự án nào
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video sm:aspect-[4/3] md:h-64 overflow-hidden bg-muted w-full">
                <Image
                  src={project.image || '/placeholder.jpg'}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.category && (
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    {project.category}
                  </Badge>
                )}
                {project.year && (
                  <Badge className="absolute top-4 right-4 bg-primary/80">
                    {project.year}
                  </Badge>
                )}
              </div>
              <CardHeader>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                {project.results && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Kết quả:</strong> {project.results}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {project.description}
                </p>
                <Link href={`/blog/${project.id}`}>
                  <Button variant="ghost" className="w-full gap-2">
                    Xem chi tiết <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
