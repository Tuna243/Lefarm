"use client"

import { use, useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, MapPin, Truck, Warehouse, Phone, Mail, ArrowLeft } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

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
  createdAt: string
  updatedAt: string
  Nutrition?: any
  ProductDetails?: any
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { t, locale } = useI18n()
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  // Helper to get localized product name based on current locale
  const getProductName = (prod: Product | null): string => {
    if (!prod) return 'Sản phẩm'
    switch (locale) {
      case 'vi':
        return prod.nameVi || prod.nameEn
      case 'ru':
        return prod.nameRU || prod.nameEn || prod.nameVi
      case 'en':
      default:
        return prod.nameEn || prod.nameVi
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) throw new Error('Not found')
        const data = await response.json()
        setProduct(data)
        const initialImage =
          (Array.isArray(data.images) && data.images.length > 0 && data.images[0]) ||
          data.image ||
          null
        setActiveImage(initialImage)

        // Fetch related products
        const relatedResponse = await fetch(`/api/products?category=${data.category}`)
        const relatedData = await relatedResponse.json()
        setRelatedProducts(relatedData.filter((p: Product) => p.id !== id).slice(0, 4))
      } catch (error) {
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p>{t.common.loading || 'Đang tải...'}</p>
          </div>
        ) : !product ? (
          <div className="flex items-center justify-center py-20">
            <p>{'Sản phẩm không tìm thấy'}</p>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="border-b bg-card">
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-foreground">
                    {t.nav.home}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link href="/marketplace" className="hover:text-foreground">
                    {t.nav.marketplace}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground">{product && getProductName(product)}</span>
                </nav>
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Back Button */}
              <Link
                href="/marketplace"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.productDetail.backToMarketplace}
              </Link>

              {/* Product Details */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-2xl border bg-card relative w-full">
                    {activeImage && (
                      <Image
                        src={activeImage}
                        alt={getProductName(product)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    )}
                    {!activeImage && (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Không có ảnh</span>
                      </div>
                    )}
                  </div>
                  {(() => {
                    const productImages = Array.isArray(product?.images) && product.images.length > 0
                      ? product.images
                      : product?.image
                        ? [product.image]
                        : []
                    return productImages.length > 1 ? (
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-4">
                        {productImages.map((img, index) => (
                          <button
                            type="button"
                            key={`${img}-${index}`}
                            className={cn(
                              "aspect-square overflow-hidden rounded-lg border bg-card transition relative",
                              img === activeImage
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setActiveImage(img)}
                          >
                            <Image
                              src={img}
                              alt={getProductName(product)}
                              fill
                              sizes="(max-width: 640px) 25vw, 20vw"
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null
                  })()}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <Badge variant="secondary" className="mb-3 capitalize">
                      {product?.category || 'Chưa phân loại'}
                    </Badge>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{product && getProductName(product)}</h1>
                  </div>

                  <div className="space-y-3 rounded-xl border bg-card p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {t.productDetail?.description || 'Thông tin chung'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.footer?.categories || 'Danh mục'}: <span className="font-medium text-foreground capitalize">{product?.category || '-'}</span>
                      {product?.productCode ? (
                        <>
                          {' '}• Mã: <span className="font-medium text-foreground">{product.productCode}</span>
                        </>
                      ) : null}
                    </p>
                  </div>

                  <Link href="/contact">
                    <Button 
                      size="lg" 
                      className="w-full gap-2"
                    >
                      <Mail className="h-5 w-5" />
                      {t.productDetail?.contactSupplier || 'Liên hệ nhà cung cấp'}
                    </Button>
                  </Link>
                </div>
              </div>

              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">
                  {t.productDetail?.description || 'Mô tả'}
                </h2>
                {product?.description ? (
                  <div
                    className="mt-4 text-base leading-relaxed text-muted-foreground prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="mt-4 text-muted-foreground">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </section>

              {/* Related Products */}
              {relatedProducts && relatedProducts.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-2xl font-bold text-foreground">{t.productDetail?.relatedProducts || 'Sản phẩm liên quan'}</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((relatedProduct) => (
                      <Link key={relatedProduct.id} href={`/marketplace/${relatedProduct.id}`}>
                        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                          <div className="aspect-square overflow-hidden bg-muted relative w-full">
                            {relatedProduct?.images?.[0] || relatedProduct?.image ? (
                              <Image
                                src={relatedProduct.images?.[0] || relatedProduct.image || "/placeholder.svg"}
                                alt={getProductName(relatedProduct)}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">Không có ảnh</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-foreground group-hover:text-primary">
                              {getProductName(relatedProduct)}
                            </h3>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
