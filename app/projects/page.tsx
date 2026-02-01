'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProjectsClient } from '@/components/projects-client'
import { useI18n } from '@/lib/i18n/context'

export default function ProjectsPage() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Page Header */}
        <div className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dự án & Portfolio
            </h1>
            <p className="mt-2 text-muted-foreground">
              Khám phá những dự án thành công của Lefarm
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ProjectsClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
