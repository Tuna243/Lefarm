"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { suppliers } from "@/lib/data"
import Image from "next/image"
import { Target, Eye, Users, TrendingUp } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function AboutPage() {
  const { t } = useI18n()

  const timeline = [
    {
      year: "2018",
      title: "Company Founded",
      description: "Started with a vision to transform agricultural logistics",
    },
    { year: "2019", title: "First 100 Partners", description: "Reached our first milestone of 100 farm partners" },
    { year: "2021", title: "Cold Chain Network", description: "Launched nationwide refrigerated logistics network" },
    { year: "2023", title: "Digital Marketplace", description: "Introduced our online B2B agricultural marketplace" },
    {
      year: "2025",
      title: "Sustainability Goals",
      description: "Achieved carbon-neutral operations across all facilities",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t.about.title}</h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.about.ourStoryDesc}</p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border bg-card p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-foreground">{t.about.mission}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{t.about.missionDesc}</p>
              </div>
              <div className="rounded-2xl border bg-card p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-foreground">{t.about.vision}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{t.about.visionDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.about.ourJourney}
            </h2>
            <div className="relative mt-12">
              <div className="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <span className="text-sm font-semibold text-primary">{item.year}</span>
                        <h3 className="mt-1 text-lg font-bold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10 hidden h-4 w-4 rounded-full bg-primary md:block" />
                    <div className="hidden flex-1 md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Users, value: "500+", label: "Partner Farms" },
                { icon: TrendingUp, value: "1M+", label: "Products Delivered" },
                { icon: Target, value: "50+", label: "Distribution Centers" },
                { icon: Eye, value: "99%", label: "Customer Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-8 w-8 text-primary-foreground/80" />
                  <p className="mt-4 text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="mt-1 text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.about.ourPartners}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">{t.about.partnersDesc}</p>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-center rounded-lg border bg-card p-4 grayscale transition-all hover:grayscale-0"
                >
                  <Image
                    src={supplier.logo || "/placeholder.svg"}
                    alt={supplier.name}
                    width={160}
                    height={80}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
