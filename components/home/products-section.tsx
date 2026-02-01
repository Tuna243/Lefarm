"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

interface Product {
  id: string
  nameVi: string
  nameEn: string
  category: string
  image: string
  description?: string
  featured: boolean
}

export function ProductsSection() {
  const { t } = useI18n()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data)
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Đang tải sản phẩm...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.products.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.products.subtitle}</p>
          </div>
          <Link href="/marketplace" className="hidden sm:block">
            <Button variant="outline" className="gap-2 bg-transparent">
              {t.products.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/marketplace/${product.id}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.nameVi || product.nameEn || 'Product image'}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 capitalize">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground group-hover:text-primary">{product.nameVi}</h3>
                  <div 
                    className="mt-1 line-clamp-2 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/marketplace">
            <Button className="gap-2">
              {t.products.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
