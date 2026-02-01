"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, Clock, User, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

interface NewsPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  status: string
  tags: string[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

function BlogContent() {
  const { t, locale } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/news?status=published')
        const data = await response.json()
        if (Array.isArray(data)) {
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = post.title.toLowerCase()
      const excerpt = (post.excerpt || '').toLowerCase()
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || excerpt.includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [searchQuery, posts])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : locale === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t.blog?.title || 'Blog & Tin tức'}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t.blog?.subtitle || 'Thông tin và kiến thức về nông nghiệp'}</p>
          </div>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.blog?.searchPlaceholder || 'Tìm kiếm bài viết...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {searchQuery === "" && posts.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-foreground">{t.blog?.featured || 'Bài viết nổi bật'}</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {posts.slice(0, 2).map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden w-full">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-foreground">{t.blog?.latestPosts || 'Bài viết mới nhất'}</h2>

          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-lg font-medium text-foreground">Đang tải...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-medium text-foreground">{t.blog?.noResults || 'Không tìm thấy bài viết'}</p>
              <p className="mt-2 text-muted-foreground">{t.blog?.noResultsDesc || 'Thử tìm kiếm với từ khóa khác'}</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden w-full">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        {t.blog?.readMore || 'Đọc thêm'}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <BlogContent />
    </Suspense>
  )
}
