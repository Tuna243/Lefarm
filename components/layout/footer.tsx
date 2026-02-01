"use client"

import Link from "next/link"
import { Leaf, Mail, Phone, MapPin, IdCard, CalendarDays } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()

  const quickLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/marketplace", label: t.nav.marketplace },
    { href: "/contact", label: t.nav.contact },
  ]

  const categories = [
    { key: "vegetables", label: t.footer.vegetables },
    { key: "fruits", label: t.footer.fruits },
    { key: "grains", label: t.footer.grains },
    { key: "organic", label: t.footer.organicProducts },
  ]

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LeFarm</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">{t.footer.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">{t.footer.quickLinks}</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">{t.footer.categories}</h3>
            <ul className="mt-4 space-y-2">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/marketplace?category=${cat.key}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">{t.footer.contactInfo}</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                CÔNG TY TNHH XUẤT NHẬP KHẨU LEFARM KHÁNH HÒA
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                LEFARM KHANH HOA IMPORT EXPORT COMPANY LIMITED
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                LEFARM KHANH HOA CO., LTD
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Thôn Võ Kiện, Xã Diên An, Huyện Diên Khánh, Tỉnh Khánh Hòa, Việt Nam
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <IdCard className="h-4 w-4 text-primary" />
                Mã số DN: 4202012735
              </li>
             
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                079.4567.157
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                lefarmkhanhhoa@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} LeFarm. {t.footer.allRightsReserved} | Design by Nguyen Hoang Tuan 
          </p>
        </div>
      </div>
    </footer>
  )
}
