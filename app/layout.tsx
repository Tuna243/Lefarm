import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n/context"
import { PageVisitTracker } from "@/components/page-visit-tracker"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic", "vietnamese"] })

export const metadata: Metadata = {
  title: "CÔNG TY TNHH XUẤT NHẬP KHẨU LEFARM KHÁNH HÒA",
  description:
    "LEFARM KHANH HOA IMPORT EXPORT COMPANY LIMITED (LEFARM KHANH HOA CO., LTD). Mã số DN: 4202012735. Trụ sở: Thôn Võ Kiện, Xã Diên An, Huyện Diên Khánh, Tỉnh Khánh Hòa, Việt Nam.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/logo.png" },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.className}`}>
        <I18nProvider>{children}</I18nProvider>
        <PageVisitTracker />
        <Analytics />
      </body>
    </html>
  )
}
