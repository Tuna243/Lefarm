'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Grid, List } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

interface Product {
  id: string
  nameVi: string
  nameEn: string
  nameRU?: string
  productCode: string
  description?: string
  image?: string
  images?: string[]
  category: string
  benefits?: string[]
  createdAt?: string
  updatedAt?: string
}

const CATEGORIES = [
  { id: 'vegetables', name: 'Rau củ' },
  { id: 'fruits', name: 'Trái cây' },
]

export function MarketplaceClient() {
  const { t, locale } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  // Helper to get localized product name based on current locale
  const getProductName = (product: Product): string => {
    switch (locale) {
      case 'vi':
        return product.nameVi || product.nameEn
      case 'ru':
        return product.nameRU || product.nameEn || product.nameVi
      case 'en':
      default:
        return product.nameEn || product.nameVi
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category === 'all' 
          ? '/api/products'
          : `/api/products?category=${category}`
        const response = await fetch(url)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search) {
      result = result.filter(
        (p) =>
          getProductName(p).toLowerCase().includes(search.toLowerCase()) ||
          p.nameVi.toLowerCase().includes(search.toLowerCase()) ||
          p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return getProductName(a).localeCompare(getProductName(b))
      return 0
    })

    return result
  }, [products, search, sortBy, locale])

  return (
    <>
      {/* Filters */}
      <div className="space-y-4 bg-muted/50 p-6 rounded-lg mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.marketplace.searchPlaceholder || 'Tìm kiếm sản phẩm...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
          {/* Category Filter */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          

          {/* View Toggle */}
          <div className="flex gap-2 md:col-span-1">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
              className="flex-1"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
              className="flex-1"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">Đang tải sản phẩm...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Không tìm thấy sản phẩm phù hợp
        </div>
      ) : (
        <div
          className={view === 'grid' 
            ? 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
          }
        >
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/marketplace/${product.id}`}>
              <Card className={`h-full hover:shadow-lg transition-shadow overflow-hidden ${view === 'list' ? 'flex' : ''}`}>
                <div className={view === 'list' ? 'relative w-32 h-32 sm:w-48 sm:h-48 shrink-0' : 'relative w-full aspect-square'}>
                  <Image
                    src={product.images?.[0] || product.image || '/placeholder.jpg'}
                    alt={getProductName(product)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className={view === 'list' ? 'object-cover rounded-l-lg' : 'object-cover rounded-t-lg'}
                    priority={false}
                  />
                </div>
                <CardContent className={`${view === 'list' ? 'flex-1' : 'w-full'} p-4`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-1 text-foreground">{getProductName(product)}</h3>
                      {locale !== 'en' && <p className="text-xs text-muted-foreground line-clamp-1">{product.nameEn}</p>}
                    </div>
                    <Badge variant="secondary" className="shrink-0">{product.category}</Badge>
                  </div>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2 mb-4"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
