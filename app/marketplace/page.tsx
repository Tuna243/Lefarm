"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useI18n } from "@/lib/i18n/context"
import { MarketplaceClient } from "@/components/marketplace-client"

export default function MarketplacePage() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Page Header */}
        <div className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.marketplace.title}</h1>
            <p className="mt-2 text-muted-foreground">{t.marketplace.subtitle}</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <MarketplaceClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
