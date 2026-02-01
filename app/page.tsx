import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BannerCarousel } from "@/components/home/banner-carousel"
import { HeroSection } from "@/components/home/hero-section"
import { NewsSection } from "@/components/home/news-section"
import { ProductsSection } from "@/components/home/products-section"
import { CompanySection } from "@/components/home/company-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <BannerCarousel />
        <HeroSection />
        <ProductsSection />
        <NewsSection />
        <CompanySection />
      </main>
      <Footer />
    </div>
  )
}
