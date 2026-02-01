"use client"

import { Leaf, Truck, Globe, Award } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function CompanySection() {
  const { t } = useI18n()

  const features = [
    {
      icon: Leaf,
      title: t.company.directFromFarm,
      description: t.company.directFromFarmDesc,
    },
    {
      icon: Truck,
      title: t.company.sustainablePractices,
      description: t.company.sustainablePracticesDesc,
    },
    {
      icon: Globe,
      title: t.company.fairPricing,
      description: t.company.fairPricingDesc,
    },
    {
      icon: Award,
      title: t.company.qualityControl,
      description: t.company.qualityControlDesc,
    },
  ]

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.company.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t.company.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
