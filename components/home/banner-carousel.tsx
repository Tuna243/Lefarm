'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/context'

interface Banner {
  id: string
  title: string
  titleEn?: string
  titleRU?: string
  subtitle?: string
  image: string
  link?: string
  order: number
  isActive: boolean
}

export function BannerCarousel() {
  const { locale } = useI18n()
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners?active=true')
        const data = await response.json()
        setBanners(data.filter((b: Banner) => b.isActive))
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  // Auto-advance slides
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [banners.length, nextSlide])

  const getTitle = (banner: Banner) => {
    switch (locale) {
      case 'vi':
        return banner.title
      case 'en':
        return banner.titleEn || banner.title
      case 'ru':
        return banner.titleRU || banner.title
      default:
        return banner.title
    }
  }

  if (isLoading) {
    return (
      <div className="relative h-[250px] sm:h-[400px] lg:h-[600px] bg-muted animate-pulse" />
    )
  }

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  const content = (
    <div className="relative h-[200px] sm:h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentBanner.image}
          alt={getTitle(currentBanner)}
          fill
          className="object-cover w-full h-full opacity-90"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {getTitle(currentBanner)}
            </h1>
            {currentBanner.subtitle && (
              <p className="text-lg sm:text-xl text-gray-200 mb-6">
                {currentBanner.subtitle}
              </p>
            )}
            {currentBanner.link && (
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Xem thêm
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )

  if (currentBanner.link) {
    return (
      <Link href={currentBanner.link} className="block">
        {content}
      </Link>
    )
  }

  return content
}
