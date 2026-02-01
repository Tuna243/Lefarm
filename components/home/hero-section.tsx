"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Users } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function HeroSection() {
  const { t } = useI18n()

  const stats = [
    { icon: Truck, label: t.hero.fastDelivery, value: "24-48h" },
    { icon: Shield, label: t.hero.qualityAssured, value: "100%" },
    { icon: Users, label: t.hero.activeFarmers, value: "500+" },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background mt-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2">
                  {t.hero.viewMarketplace}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  {t.hero.contactUs}
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video lg:aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/aerial-view-of-farm-fields-with-vegetables.jpg"
                alt="Farm fields with fresh produce"
                width={600}
                height={600}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-card p-4 shadow-lg">
              <p className="text-sm font-medium text-muted-foreground">{t.hero.freshDaily}</p>
              <p className="text-2xl font-bold text-primary">1,000+ {t.hero.products}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
