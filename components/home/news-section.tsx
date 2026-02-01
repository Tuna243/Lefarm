"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt?: string
  image?: string
  tags: string[]
  createdAt: string
  publishedAt?: string
}

export function NewsSection() {
  const { t } = useI18n()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/news?status=published')
        if (response.ok) {
          const allArticles: NewsArticle[] = await response.json()

          // Get current month and year
          const now = new Date()
          const currentMonth = now.getMonth()
          const currentYear = now.getFullYear()

          // Filter articles from current month
          const monthArticles = allArticles.filter(article => {
            const articleDate = new Date(article.publishedAt || article.createdAt)
            return articleDate.getMonth() === currentMonth &&
              articleDate.getFullYear() === currentYear
          })

          // Get maximum 4 most recent articles
          setArticles(monthArticles.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading || articles.length === 0) {
    return null
  }

  const [featuredArticle, ...sideArticles] = articles

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.news.title}</h2>
          <p className="mt-2 text-muted-foreground">{t.news.subtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured Article - Left Side */}
          {featuredArticle && (
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group relative h-full overflow-hidden rounded-lg w-full"
            >
              <div className="relative aspect-4/3 lg:aspect-auto lg:h-full w-full overflow-hidden">
                <Image
                  src={featuredArticle.image || "/placeholder.svg"}
                  alt={featuredArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {featuredArticle.tags.slice(0, 2).map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold leading-tight sm:text-2xl">
                    {featuredArticle.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/90">
                    {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Side Articles - Right Side */}
          <div className="flex flex-col gap-6">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex gap-3 md:gap-4 overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative h-20 w-24 sm:h-24 sm:w-32 md:h-32 md:w-40 shrink-0 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center py-2 pr-4 md:py-3">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {article.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[10px] md:text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h4 className="line-clamp-2 text-sm md:text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                    {article.title}
                  </h4>
                  <p className="mt-1 md:mt-2 text-[10px] md:text-xs text-muted-foreground">
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
